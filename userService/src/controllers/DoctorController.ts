import DoctorModel, { DoctorInterface } from "../models/doctorModel";
import { Request, Response } from "express";
import { uploadToS3Bucket } from "../utils/s3Bucket";
import bcrypt from "bcrypt";
import produce from "../config/kafka/producer";
import JwtService from "../utils/jwt";

import { SlotInterface }  from "../models/slotModel";
import SlotModel from "../models/slotModel";
import { IDoctorController } from "./interface/IDoctorController";
import { IDoctorService } from "../services/interface/IDoctorService";


import { StatusCode } from '../utils/enum';
import { ResponseError } from '../utils/constants';


export class DoctorController implements IDoctorController {

  private doctorService: IDoctorService;
  constructor(doctorService :IDoctorService) {
    this.doctorService = doctorService
  }

  public async addDoctor(payload: DoctorInterface): Promise<void> {
    try {
      let response = await this.doctorService.createDoctor(payload);
    } catch (error) {
      console.log(error);
    }
  }

  public async getDoctor(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      // console.log(email,"get Doctor Data")
      let response = await this.doctorService.getDoctorData(email);
      console.log(response)
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      const { name , Mobile , email , department , education , experience , consultationType , description , consultationFee , doctorProfileData ,location  } = req.body;

      console.log("consultationFee" , consultationFee)

      console.log(req.body, "update Doctor Data");
      console.log(req.file, "update Doctor Data");

      let profilePicture  ;
      let response;


      
      if (req.file) {
        console.log("with profile pic")
        profilePicture = await uploadToS3Bucket(req.file, "doctorsProfile");
        
        response = await this.doctorService.updateProfile( email ,  { name , Mobile , profilePicture , department , education , experience , consultationType , description , consultationFee , doctorProfileData , location});
      } else {
       
        console.log("without profile pic")
        response = await this.doctorService.updateProfile( email ,  { name , Mobile , email , department , education , experience , consultationType , description , consultationFee , doctorProfileData , location });
      }
      
     
      

      if (response) {
        await produce("update-profile-doctor",{email ,profilePicture : profilePicture , location});
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
    }
  }

  public async updatePassword(req: Request, res: Response): Promise<any> {
    try {
      console.log(req.body, "...")
      const { currentPassword, newPassword } = req.body;
      console.log("password..." , currentPassword, newPassword )
      const jwtService = new JwtService();
      const tokenData = await jwtService.verifyToken(req.cookies["accessToken2"]);

      if (!tokenData) {
        throw new Error("Token expiered!");
      }
      let email = tokenData.email;
      const response = await this.doctorService.getDoctorData(email);
      if (!response) {
        throw new Error("No user Found");
      }

      const oldPassword = response?.hashedPassword;

      const result = await bcrypt.compare(currentPassword, oldPassword);
      if (result) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const response = await this.doctorService.updatePassword(
          email,
          hashedPassword
        );
        if (response) {
          await produce("update-password-doctor",{email,password:hashedPassword})
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

  public async getDoctors(req:Request,res:Response){
    try {
    
      const Doctors=await this.doctorService.getDoctors()
      console.log(Doctors,"Doctors allll")
       res.status(StatusCode.OK).json({
        users:Doctors
      })
    } catch (error) {
      console.log(error);
      
    }
  }
  public async blockDoctor(req:Request,res:Response): Promise<void>{
    try {
      const { email }=req.params
      console.log(email,"Doctor...")

      const DoctorData=await this.doctorService.getDoctorData(email)

      if(!DoctorData){
        throw new Error("No user found")
      }
      const id=DoctorData._id
      const isBlocked=!DoctorData?.isBlocked

      const DoctorStatus=await this.doctorService.updateProfile( email,{isBlocked})
      await produce("block-doctor",{email,isBlocked})

      if(DoctorStatus?.isBlocked){
        res.status(StatusCode.OK).json({
          success:true,
          message:"Doctor Blocked"
        })
      }else{
        res.status(StatusCode.OK).json({
          success:true,
          message:"Doctor UnBlocked"
        })

      }
      
    } catch (error) {
      console.log(error)
      
    }
  }


   public async findAllBanners(req:Request,res:Response): Promise<void>{
      try {
      
        const banners=await this.doctorService.findAllBanners()
       
         res.status(StatusCode.OK).json({
          banners:banners
        })
      } catch (error) {
        console.log(error);
        
      }
    }


  ///kafka consume
  async passwordReset(data:any) : Promise<DoctorInterface | null | undefined>{
    try {
      const {password,email}=data
      const response = await this.doctorService.updatePassword(
        email,
        password
      );
      return response
    } catch (error) {
      console.log(error)
    }
  }


  async VerificationRequest(data:any): Promise<DoctorInterface | null | undefined>{
    try {
      const {emailID , status ,medicalLicenseUrl , degreeCertificateUrl}=data
      console.log(emailID , status ,medicalLicenseUrl , degreeCertificateUrl, 'coming...')
      const response = await this.doctorService.VerificationRequest(
        emailID,
        status,
        medicalLicenseUrl ,
        degreeCertificateUrl,
      );
      return response
    } catch (error) {
      console.log(error)
    }
  }


  async createSlot(payload : SlotInterface): Promise<void> {
    try {
      console.log("data base..slot comingo...", payload);

      const slot = await SlotModel.create(payload);  
      console.log("base respo", slot);
      
    } catch (error) {
      console.error("Error creating slot:", error);
    
    }
}


  async removeSlot(payload : SlotInterface): Promise<void> {
    try {
      console.log("data base id..", payload);

      const {_id } = payload ;

      const slot = await SlotModel.findOneAndDelete({_id : _id });
      console.log("base respo id", slot);
      
    } catch (error) {
      console.error("Error creating slot:", error);
      
    }


}



async updateWallet( data:{doctorId : string ,appointmentId : string , transactionId : string , amount : number , type : string}): Promise<DoctorInterface | undefined | null>{
  try {


    console.log("update- doctor wallet data" , data)
    const { doctorId , appointmentId , transactionId, amount , type } = data ;

    const doctorDetails = await DoctorModel.findById({ _id : doctorId}) ;

    if (!doctorDetails){
      throw new Error("No doctor details not found");
    }

    const transactions = doctorDetails?.wallet.transactions ?? [];

    const description = `Cancelled Appointment Id : ${appointmentId}`;
    const refundAmount = type === "credit" ? amount * 0.1 : amount; 

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
   ? doctorDetails.wallet.balance - amount
   : doctorDetails.wallet.balance + refundAmount;



   const walletDetails = {
      balance: newBalance,
      transactions: [...transactions, newTransaction],
  };
   
  console.log("Updated Wallet Data:", walletDetails);



  const response = await this.doctorService.updateWallet(doctorId, walletDetails);
    return response
  } catch (error) {
    console.log(error)
  }
}




}