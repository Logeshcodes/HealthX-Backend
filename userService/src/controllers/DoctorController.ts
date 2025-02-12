import { DoctorInterface } from "../models/doctorModel";
import { Request, Response } from "express";
import { DoctorServices } from "../services/doctorServices";
import { uploadToS3Bucket } from "../utils/s3Bucket";
import bcrypt from "bcrypt";
import verifyToken from "../utils/jwt";
import produce from "../config/kafka/producer";
import mongoose from "mongoose";
import JwtService from "../utils/jwt";

import { IDoctorController } from "./interface/IDoctorController";
import { IDoctorService } from "../services/interface/IDoctorService";

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
      const { name , Mobile , email , department , education , experience , consultationType , description , consultationFee , doctorProfileData ,  } = req.body;

      console.log(req.body, "update Doctor Data");
      console.log(req.file, "update Doctor Data");

      let profilePicture = "No Picture";
      let response;


      
      if (req.file) {
        console.log("with profile pic")
        profilePicture = await uploadToS3Bucket(req.file, "doctorsProfile");
        
        response = await this.doctorService.updateProfile( email ,  { name , Mobile , profilePicture , department , education , experience , consultationType , description , consultationFee , doctorProfileData });
      } else {
       
        console.log("without profile pic")
        response = await this.doctorService.updateProfile( email ,  { name , Mobile , email , department , education , experience , consultationType , description , consultationFee , doctorProfileData });
      }
      
     
      

      if (response) {
        await produce("update-profile-doctor",{email ,profilePicture : profilePicture })
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
      console.log(req.body, "...")
      const { currentPassword, newPassword } = req.body;
      console.log("password..." , currentPassword, newPassword )
      const jwtService = new JwtService();
      const tokenData = await jwtService.verifyToken(req.cookies["accessToken"]);

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

  public async getDoctors(req:Request,res:Response){
    try {
    
      const Doctors=await this.doctorService.getDoctors()
      console.log(Doctors,"Doctors allll")
       res.status(200).json({
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
        res.status(200).json({
          success:true,
          message:"Doctor Blocked"
        })
      }else{
        res.status(200).json({
          success:true,
          message:"Doctor UnBlocked"
        })

      }
      
    } catch (error) {
      console.log(error)
      
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
}