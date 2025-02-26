import { UserInterface } from "../models/userModel";
import { Request, response, Response } from "express";


import { uploadToS3Bucket } from "../utils/s3Bucket";
import bcrypt from "bcrypt";
import JwtService from "../utils/jwt";
import produce from "../config/kafka/producer";

import { IUserController } from "./interface/IUserController";
import { IUserService } from "../services/interface/IUserService";

import { config } from 'dotenv';

config()


import AppointmentModel from "../models/appointmentModel";
import { AppointmentInterface } from "../models/appointmentModel";
import DoctorModel from "../models/doctorModel";
import SlotModel from "../models/slotModel";


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
  
  public async findAllBanners(req:Request,res:Response): Promise<void>{
    try {
    console.log('lissssssssst')
      const banners=await this.userService.findAllBanners()
      console.log(banners,"findAllBanner allll")
       res.status(200).json({
        banners:banners
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



  // get All appointments by email to user :
  public async getAllAppointmentDetails(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const { page, limit, activeTab } = req.query;
  
      console.log(`Fetching appointments for email: ${email} - Page: ${page}, Limit: ${limit}, activeTab: ${activeTab}`);
  
      const pageNum = Math.max(Number(page) || 1, 1);
      const limitNum = Math.max(Number(limit) || 10); 
      const skip = (pageNum - 1) * limitNum;
  
      
      const baseQuery: any = { patientEmail: email };
  
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
  
      switch (activeTab) {
        case 'upcoming':
          baseQuery.appointmentDate = { $gte: today }; 
          baseQuery.status = { $ne: 'cancelled' }; 
          break;
        case 'past':
          baseQuery.appointmentDate = { $lt: today }; 
          baseQuery.status = { $ne: 'cancelled' }; 
          break;
        case 'cancelled':
          baseQuery.status = 'cancelled'; 
          break;
        default:
          
          break;
      }
  
      // Fetch ALL filtered appointments
      const allAppointments = await AppointmentModel.find(baseQuery).exec();
  
      // Apply pagination manually
      const totalAppointments = allAppointments.length;
      const paginatedAppointments = allAppointments.slice(skip, skip + limitNum);
  
      console.log("Response:", paginatedAppointments, "Total Appointments:", totalAppointments, "Page:", pageNum);
  
      if (paginatedAppointments.length > 0) {
        res.json({
          success: true,
          message: "Appointments fetched successfully",
          data: paginatedAppointments,
          total: totalAppointments,
          page: pageNum,
          totalPages: Math.ceil(totalAppointments / limitNum),
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No appointments found!",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  

  public async getAppointment(req: Request, res: Response): Promise<void> {

    try {


      const { email } = req.params;
      

      console.log(`Fetching appointments for email: ${email}`);



      const response = await this.userService.getAppointment(email);


      if (response) {
        
        res.json({
            success: true,
            message: "totalAppointments fetched successfully",
            data: response,
            
        });
    } else {
        res.status(404).json({
            success: false,
            message: "No slots found!",
        });
    }
      
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
          success: false,
          message: "Internal server error",
      });
    }



  }



  async paymentSuccess(req: Request, res: Response): Promise<any> {
    try {
      console.log("Received Request Body:", req.body);
  
      const { txnid, amount, productinfo, firstname, email, udf1, phone, status } = req.body;
  
      console.log(txnid, amount, productinfo, firstname, email, udf1, phone, status, "details");
  
  
      const slot = await SlotModel.findById(productinfo);
      if (!slot) {
        return res.status(404).json({ error: "Slot not found" });
      }
      
      if(slot){
        await produce('slot-booked', slot )
      }
   
      const updateResponse = await SlotModel.findByIdAndUpdate(
        productinfo, 
        { $set: { avaliable: false } },
        { new: true }
      
      );
  
      console.log("Updated slot:", updateResponse);
  
      const doctorEmail = slot.email;
  
      const doctor = await DoctorModel.findOne({ email: doctorEmail });
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      const appointment = new AppointmentModel({
        doctorName : doctor.name ,
        profilePicture : doctor.profilePicture ,
        doctorEmail: doctor.email,
        location : doctor.location,
        patientEmail: udf1, 
        paymentId: txnid,
        amount: amount,
        mode: slot.mode,
        department : doctor.department ,
        paymentStatus: status,
        appointmentDate: slot.date,
        appointmentDay: slot.day,
        appointmentTime: slot.timeSlot,
      });
  
      const savedAppointment = await appointment.save();
  
      // res.status(200).json({
      //   success:true,
      //   message: "Payment successful and appointment booked!",
      //   appointment: savedAppointment,
      // });

      setTimeout(() => {
        res.redirect(`http://localhost:3000/user/patient/payment-success/${txnid}`);
      }, 1000);

    } catch (error) {
      
      console.error("Error in paymentSuccess:", error);
      res.status(500).json({ error: "Error processing payment success" });
    }
  };

  async paymentFailure(req: Request, res: Response): Promise<any>{

    return res.redirect(`http://localhost:3000/user/patient/payment-failure`);

  }
  

  async getAppointmentDetails(req: Request, res: Response): Promise<any> {
    try {
        const { txnid } = req.params;

        console.log(txnid, "id....");

        if (!txnid) {
            return res.status(400).json({ message: "Transaction ID is required" });
        }

        const appointment = await AppointmentModel.findOne({ paymentId: txnid });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        console.log("return appointment", appointment);
        return res.status(200).json(appointment);

    } catch (error) {
        console.error("Error fetching appointment:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


 

}