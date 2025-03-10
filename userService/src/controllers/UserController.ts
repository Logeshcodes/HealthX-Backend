import UserModel, { UserInterface } from "../models/userModel";
import { Request, response, Response } from "express";


import { uploadToS3Bucket } from "../utils/s3Bucket";
import bcrypt from "bcrypt";
import JwtService from "../utils/jwt";
import produce from "../config/kafka/producer";

import { IUserController } from "./interface/IUserController";
import { IUserService } from "../services/interface/IUserService";


import { StatusCode } from '../utils/enum';
import { ResponseError } from '../utils/constants';
import { config } from 'dotenv';

config()




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
        res.status(StatusCode.OK).json({
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
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
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
          res.status(StatusCode.OK).json({
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
       res.status(StatusCode.OK).json({
        users:users
      })
    } catch (error) {
      console.log(error);
      
    }
  }
  
  public async findAllBanners(req:Request,res:Response): Promise<void>{
    try {
    
      const banners=await this.userService.findAllBanners()
     
       res.status(StatusCode.OK).json({
        banners:banners
      })
    } catch (error) {
      console.log(error);
      
    }
  }
  public async findAllDoctors(req:Request,res:Response): Promise<void>{
    try {
    
      const users=await this.userService.findAllDoctors()
     
       res.status(StatusCode.OK).json({
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
       res.status(StatusCode.OK).json({
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
        res.status(StatusCode.OK).json({
          success:true,
          message:"User Blocked"
        })
      }else{
        res.status(StatusCode.OK).json({
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

  async updateWallet( data:{userId : string ,appointmentId : string , transactionId : string , amount : number , type : string}): Promise<UserInterface | undefined | null>{
    try {


      console.log("update wallet data" , data)
      const { userId , appointmentId , transactionId, amount , type } = data ;

      const userDetails = await UserModel.findById({ _id : userId}) ;

      if (!userDetails){
        throw new Error("No user details not found");
      }

      const transactions = userDetails?.wallet.transactions ?? [];

      const description = `Cancelled Appointment Id : ${appointmentId}`;
      const refundAmount = type === "credit" ? amount * 0.9 : amount; 

      // transaction object
      const newTransaction = {
        amount: refundAmount,
        description,
        transactionId,
        type,
        date: new Date(), 
    };


     // Update wallet balance
     const newBalance = type === "debit"
     ? userDetails.wallet.balance - amount
     : userDetails.wallet.balance + refundAmount;



     const walletDetails = {
        balance: newBalance,
        transactions: [...transactions, newTransaction],
    };
     
    console.log("Updated Wallet Data:", walletDetails);



    const response = await this.userService.updateWallet(userId, walletDetails);
      return response
    } catch (error) {
      console.log(error)
    }
  }






 

 

}