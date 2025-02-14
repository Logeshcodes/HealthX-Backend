import { UserInterface } from "../models/userModel";
import { Request, Response } from "express";

import UserServices from "../services/userServices";

import { uploadToS3Bucket } from "../utils/s3Bucket";
import bcrypt from "bcrypt";
import verifyToken from "../utils/jwt";
import JwtService from "../utils/jwt";
import produce from "../config/kafka/producer";

import { IUserController } from "./interface/IUserController";
import { IUserService } from "../services/interface/IUserService";


export default class UserController implements IUserController  {

  private userService: IUserService;
  constructor(userService:IUserService) {
    this.userService = userService;
  }

  public async addUser(payload: UserInterface): Promise<void> {
    try {
      console.log('in the ontroller ', payload)

      let response = await this.userService.createUser(payload);
      //return response
      console.log("user created =>>>>>>>>>>>",response)
    } catch (error) {
      console.log(error);
    }
  }

  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      console.log(email,"get user Data poda")
      let response = await this.userService.getUserData(email);
       console.log(response , "Res")
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }

  public async getDoctorDetails(req: Request, res: Response): Promise<any> {
    try {
      const { email } = req.params;
      console.log(email,"get user doctor Data ")
      let response = await this.userService.getDoctorDetails(email);
       console.log(response , "Res")
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      const { username, email, MobileNumber, age, gender, height, weight, bloodGroup } = req.body;
  
      console.log(req.body.profilePicture, "update User Data");
      console.log(req.file, "profilepic - update User Data");
      // console.log(req, "profilepics - update User Data");

  
      let profilePicture = "No picture";
      let response;
  
      // Handle file upload if available
      if (req.file) {
        console.log("with profile pic");
        profilePicture = await uploadToS3Bucket(req.file, "usersProfile");
  
        response = await this.userService.updateProfile(email, {
          username,
          MobileNumber,
          profilePicture,
          age,
          gender,
          height,
          weight,
          bloodGroup,
        });
      } else {
        console.log("without profile pic");
        response = await this.userService.updateProfile(email, {
          username,
          MobileNumber,
          age,
          gender,
          height,
          weight,
          bloodGroup,
        });
      }
  
      // Send response to client
      if (response) {
        await produce("update-profile-user", {email ,profilePicture : profilePicture });
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
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the profile.",
      });
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

  public async getUsers(req:Request,res:Response): Promise<void>{
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
  
  public async findAllDoctors(req:Request,res:Response): Promise<void>{
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
  public async findAllDepartment(req:Request,res:Response): Promise<void>{
    try {
    console.log('findAllDepartment')
      const departments=await this.userService.findAllDepartment()
      console.log(departments,"findAllDoctors allll")
       res.status(200).json({
        departments:departments
      })
    } catch (error) {
      console.log(error);
      
    }
  }


  public async blockUser(req:Request,res:Response): Promise<void>{
    try {
      const { email }=req.params

      const userData=await this.userService.getUserData(email)

      if(!userData){
        throw new Error("No user found")
      }
      const id=userData._id
      const isBlocked=!userData?.isBlocked

      const userStatus=await this.userService.updateProfile( email,{isBlocked})
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
  async passwordReset(data:any): Promise<UserInterface | undefined | null>{
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