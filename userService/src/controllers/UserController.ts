import UserModel, { UserInterface } from "../models/userModel";
import { Request, Response } from "express";
import { uploadToS3Bucket } from "../utils/s3Bucket";
import { WalletData } from "../types/walletType";
import bcrypt from "bcrypt";
import JwtService from "../utils/jwt";
import produce from "../config/kafka/producer";
import { IUserController } from "./interface/IUserController";
import { IUserService } from "../services/interface/IUserService";
import { config } from 'dotenv';

import { StatusCode } from '../utils/enum';
import { ResponseError } from '../utils/constants';
import { ReportInterface } from "../models/reportModel";

config()

export default class UserController implements IUserController  {

  private userService: IUserService;
  constructor(userService:IUserService) {
    this.userService = userService;
  }

  ///kafka consume

  public async addUser(payload: UserInterface): Promise<void> {
    await this.userService.createUser(payload);
  }


  public async addReport(req: Request, res: Response): Promise<void> {
    
    try {


      const { doctorId , userId ,  reportType , description} = req.body;
      // const { payload} = req.body;


      const response = await this.userService.createReport(doctorId , userId ,  reportType , description);

      if (response) {
        
        res.status(StatusCode.OK).json({
          success: true,
          message: ResponseError.REPORT_ADDED,
        });
      } else {
        res.json({
          success: false,
          message: ResponseError.NOT_FOUND,
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
    
  async passwordReset(data:{email : string , hashedPassword : string}): Promise<void>{
    const { email , hashedPassword } = data ;
    await this.userService.updatePassword(email, hashedPassword);
  }

  
  async updateWalletCancelAppointment( data: WalletData): Promise <void>{
    try {
      const { userId , appointmentId , transactionId, amount , type } = data ;
      if (!userId) {
        throw new Error("User ID is required");
      }
      const userDetails = await UserModel.findById({ _id : userId}) ;
      if (!userDetails){
        throw new Error(ResponseError.USER_NOT_FOUND);
      }
      const transactions = userDetails?.wallet.transactions ?? [];

      const description = `Cancelled Appointment Id : ${appointmentId}`;
      const refundAmount = type === "credit" ? amount * 0.8 : amount; 

      const newTransaction = {amount: refundAmount,description,transactionId,type,date: new Date()};
      const newBalance = type === "debit"? userDetails.wallet.balance - amount: userDetails.wallet.balance + refundAmount;
      const walletDetails = {balance: newBalance,transactions: [...transactions, newTransaction],
    };
    await this.userService.updateWallet( userId, walletDetails);

    } catch (error) {
      console.log(error);
    }
  }


  async updateWalletBookAppointment( data: WalletData): Promise <void>{
    try {
      const { userId , appointmentId , transactionId, amount , type } = data ;

      console.log("user side update agala : " ,  userId , appointmentId , transactionId, amount , type)
      if (!userId) {
        throw new Error("User ID is required");
      }
      const userDetails = await UserModel.findById({ _id : userId}) ;
      console.log("user irukaru : " ,  userDetails)
      if (!userDetails){
        throw new Error(ResponseError.USER_NOT_FOUND);
      }
      const transactions = userDetails?.wallet.transactions ?? [];

      const description = `Booked Appointment Id : ${appointmentId}`;
      const refundAmount =  amount; 

      const newTransaction = {amount: refundAmount,description,transactionId,type,date: new Date()};
      const newBalance = userDetails.wallet.balance - amount
      const walletDetails = {balance: newBalance,transactions: [...transactions, newTransaction],
    };
    let response = await this.userService.updateWallet( userId, walletDetails);

    console.log("update agitucha solu : " , response)

    } catch (error) {
      console.log(error);
    }
  }
  
  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      let response = await this.userService.getUserData(email);
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
  
      let profilePicture = "No picture";
      let response;
  
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

      if (response) {
        await produce("update-profile-user", {email ,profilePicture : profilePicture });
        res.status(StatusCode.OK).json({
          success: true,
          message: ResponseError.PROFILE_UPDATE,
          user: response,
        });
      } else {
        res.json({
          success: false,
          message: ResponseError.PROFILE_NOT_UPDATE,
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
        throw new Error(ResponseError.USER_NOT_FOUND);
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
            message: ResponseError.PASSWORD_UPDATED,
          });
        } else {
          res.json({
            success: false,
            message: ResponseError.PASSWORD_NOT_UPDATED,
          });
        }
      } else {
        res.json({
          success: false,
          message: ResponseError.PASSWORD_WRONG,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getUsers(req:Request,res:Response): Promise<void>{
    try {
    const users=await this.userService.getUsers();
       res.status(StatusCode.OK).json({users:users})
    } catch (error) {
      console.log(error);
    }
  }
  
  public async findAllBanners(req:Request,res:Response): Promise<void>{
    try {
    
      const banners=await this.userService.findAllBanners();
       res.status(StatusCode.OK).json({banners:banners}) ;
    } catch (error) {
      console.log(error); 
    }
  }

  public async findAllDoctors(req:Request,res:Response): Promise<void>{
    try {
      const users=await this.userService.findAllDoctors();
       res.status(StatusCode.OK).json({users:users})
    } catch (error) {
      console.log(error);
    }
  }

  public async findAllDepartment(req:Request,res:Response): Promise<void>{
    try {
      const departments=await this.userService.findAllDepartment()
       res.status(StatusCode.OK).json({departments:departments});
    } catch (error) {
      console.log(error);
    }
  }


  public async blockUser(req:Request,res:Response): Promise<void>{
    try {
      const { email }=req.params;
      const userData=await this.userService.getUserData(email);

      if(!userData){
        throw new Error(ResponseError.USER_NOT_FOUND);
      }
      const isBlocked=!userData?.isBlocked;

      const userStatus=await this.userService.updateProfile( email,{isBlocked});
      await produce("block-user",{email,isBlocked});

      if(userStatus?.isBlocked){
        res.status(StatusCode.OK).json({
          success:true,
          message:ResponseError.ACCOUNT_BLOCKED
        })
      }else{
        res.status(StatusCode.OK).json({
          success:true,
          message: ResponseError.ACCOUNT_UNBLOCKED
        })
      } 
    } catch (error) {
      console.log(error); 
    }
  }










 

 

}