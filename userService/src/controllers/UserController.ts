import { UserInterface } from "../models/userModel";
import { Request, Response } from "express";

import UserServices from "../services/userServices";

import { uploadToS3Bucket } from "../utils/s3Bucket";
import bcrypt from "bcrypt";
import verifyToken from "../utils/jwt";
import JwtService from "../utils/jwt";
import produce from "../config/kafka/producer";


export default class UserController {
  private userService: UserServices;
  constructor() {
    this.userService = new UserServices();
  }

  public async addUser(payload: UserInterface): Promise<any> {
    try {
      let response = await this.userService.createUser(payload);
    } catch (error) {
      console.log(error);
    }
  }
  public async getUser(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.params;
      console.log(email,"get user Data poda")
      let response = await this.userService.getUserData(email);
       console.log(response)
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      const { _id, username, mobile } = req.body;
      console.log(req.body, "update User Data");
      console.log(req.file, "update User Data");

      let profilePicUrl = "No Picture";
      let response;
      
      if (req.file) {
        console.log("with profile pic")
        profilePicUrl = await uploadToS3Bucket(req.file, "users");
        
        response = await this.userService.updateProfile(_id, {
          username,
          mobile,
          profilePicUrl,
        });
      } else {
        console.log("without profile pic")
        response = await this.userService.updateProfile(_id, {
          username,
          mobile,
        });
      }

      if (response) {
        await produce("update-profile-user",response)
        res.status(200).json({
          success: true,
          message: "Profile Updated!",
          user: response,
        });
      } else {
        res.json({
          success: false,
          message: "Not Updated!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async updatePassword(req: Request, res: Response): Promise<any> {
    try {
      const { currentPassword, newPassword } = req.body;
      const jwtService = new JwtService();
      const tokenData = await jwtService.verifyToken(req.cookies["accessToken"]);

      if (!tokenData) {
        throw new Error("Token expiered!");
      }
      let email = tokenData.email;
      const response = await this.userService.getUserData(email);
      if (!response) {
        throw new Error("No user Found");
      }

      const oldPassword = response?.hashedPassword;

      const result = await bcrypt.compare(currentPassword, oldPassword);
      if (result) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const response = await this.userService.updatePassword(
          email,
          hashedPassword
        );
        if (response) {
          await produce("update-password-user",{email,password:hashedPassword})
          res.status(200).json({
            success: true,
            message: "Password Updated",
          });
        } else {
          res.json({
            success: false,
            message: "Password Not Updated",
          });
        }
      } else {
        res.json({
          success: false,
          message: "Current Password is Wrong",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getUsers(req:Request,res:Response){
    try {
    
      const users=await this.userService.getUsers()
      console.log(users,"users allll")
       res.status(200).json({
        users:users
      })
    } catch (error) {
      console.log(error);
      
    }
  }
  
  public async findAllDoctors(req:Request,res:Response){
    try {
    console.log('lissssssssst')
      const users=await this.userService.findAllDoctors()
      console.log(users,"findAllDoctors allll")
       res.status(200).json({
        users:users
      })
    } catch (error) {
      console.log(error);
      
    }
  }


  public async blockUser(req:Request,res:Response){
    try {
      const { email }=req.params

      const userData=await this.userService.getUserData(email)

      if(!userData){
        throw new Error("No user found")
      }
      const id=userData._id
      const isBlocked=!userData?.isBlocked

      const userStatus=await this.userService.updateProfile(id,{isBlocked})
      await produce("block-user",{email,isBlocked})

      if(userStatus?.isBlocked){
        res.status(200).json({
          success:true,
          message:"User Blocked"
        })
      }else{
        res.status(200).json({
          success:true,
          message:"User UnBlocked"
        })

      }
      
    } catch (error) {
      console.log(error)
      
    }
  }


  ///kafka consume
  async passwordReset(data:any){
    try {
      const {password,email}=data
      const response = await this.userService.updatePassword(
        email,
        password
      );
      return response
    } catch (error) {
      console.log(error)
    }
  }
}