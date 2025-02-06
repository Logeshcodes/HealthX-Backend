import { Request, Response } from "express";
import bcrypt from "bcrypt";

import DoctorService from "../services/DoctorService";
import { OtpGenerate } from "../utils/otpGenerator";
import  otpService  from "../services/otpService";

import JwtService from "../utils/jwt";

import IDoctorControllers from "./interface/IDoctorController";
import IDoctorServices from "@/services/interfaces/IDoctorService";
import IOtpServices from "@/services/interfaces/IOtpService";


import produce from "../config/kafka/producer";
import { DoctorInterface } from "@/models/doctorModel";

export default class DoctorController implements IDoctorControllers {

    private doctorService: IDoctorServices;
    private otpService: IOtpServices;

    private otpGenerate: OtpGenerate;
    private JWT: JwtService;
  
    constructor( doctorService : IDoctorServices , otpService : IOtpServices) {
        this.doctorService = doctorService ;
        this.otpService = otpService ;
        this.otpGenerate = new OtpGenerate();
        this.JWT = new JwtService();
      }



      async getAllDepartments(req: Request, res: Response): Promise<any> {
        try {
          // Fetch all departments from the service
          const departments = await this.doctorService.getAllDepartments();
      
          if (departments && departments.length > 0) {
            return res.status(200).json({
              success: true,
              message: "Departments retrieved successfully",
              departments,
            });
          } else {
            return res.status(404).json({
              success: false,
              message: "No departments found",
            });
          }
        } catch (error: any) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
          });
        }
      }


      public async doctorSignUp(req: Request, res: Response): Promise<any> {
        try {

          let { name,email,password,Mobile,department,consultationType,education,experience,description } = req.body;

          console.log("ResData:", name,email,password,Mobile,department,consultationType,education,experience,description );
      
          const hashedPassword = await bcrypt.hash(password, 10);
      
          const ExistingDoctor = await this.doctorService.findByEmail(email);
      
          console.log(ExistingDoctor, "ExistingDoctor");
      
          if (ExistingDoctor) {
            return res.json({
              success: false,
              message: "Existing user",
              user: ExistingDoctor,
            });

          } else {

            const otp = await this.otpGenerate.createOtpDigit();
            await this.otpService.createOtp(email, otp);
      
            // await this.sendEmail.SendEmailVerification(email, otp);
            produce('send-otp-email',{email,otp})
      
            const JWT = new JwtService();
            const tokenPayload = {
              name,
              email,
              hashedPassword,
              Mobile,
              department,
              consultationType,
              education,
              experience,
              description,
              role: "Doctor",
            };
      
            const token = await JWT.createToken(tokenPayload);
      
            return res.status(201).json({
              success: true,
              message: "Signup successful, OTP sent to email",
              token,
            });
          }
        } catch (error: any) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
          });
        }
      }
      


      public async createUser(req: Request, res: Response): Promise<any> {
        try {
          const { otp } = req.body;
          console.log(req.file,"reqqq")
          console.log(req.headers, "headersssss");
          const token = req.headers["the-verify-token"] || "";
          console.log(token, "token");
          if (typeof token != "string") {
            throw new Error();
          }


          const decode = await this.JWT.verifyToken(token);
          console.log("decode Token data : " , decode);

          if (!decode) {
            return new Error("token has expired, register again");
          }

          const resultOtp = await this.otpService.findOtp(decode.email);
          console.log(resultOtp?.otp, "<>", otp);
          if (resultOtp?.otp === otp) {
            console.log("matched");
            console.log("decode???" , decode);
      


            const user = await this.doctorService.createUser(decode);
            if (user) {
              await produce("add-doctor", user);
              await this.otpService.deleteOtp(user.email);
    
              return res.status(201).json({
                success: true,
                message: "Doctor registration completed successfully!",
                user,
              });
            }
          } else {
            return res.json({
              success: false,
              message: "Wrong Otp",
            });
          }
        } catch (error: any) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
          });
        }
      }







      public async login(req: Request, res: Response): Promise<any> {
        try {
          const { email, password } = req.body;
          console.log("Login request:", email);
  
          const doctor = await this.doctorService.findByEmail(email);
          console.log(doctor, "doctor");
    
          if (!doctor) {
            return res.json({
              success: false,
              message: "invalid email id",
            });
          }
    
          const isPasswordValid = await bcrypt.compare(
            password,
            doctor.hashedPassword
          );
          console.log(isPasswordValid, "isPasswordValid");
    
          if (!isPasswordValid) {
            return res.json({
              success: false,
              message: "Invalid Password",
            });
          }
          let role = doctor.role;
          // Generate a JWT token if credentials are correct
          const accesstoken = await this.JWT.accessToken({ email, role });
          const refreshToken = await this.JWT.refreshToken({ email, role });
    
          // Return the token in the response
          return (
            res
              .status(200)
              .cookie("accessToken", accesstoken,{ httpOnly: true })
              .cookie("refreshToken", refreshToken,{ httpOnly: true })
              .send({
                success: true,
                message: "Doctor Logged Successfully",
                user: doctor,
              })
          );
        } catch (error: any) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
          });
        }
      }




      async doGoogleLogin(req:Request,res:Response) {
        try {
            console.log("Google login in controller", req.body);
            
            const { name, email, password } = req.body;
          const ExistingDoctor=await this.doctorService.findByEmail(email)
          if (!ExistingDoctor) {
            
            console.log("Doctor does not exist. Redirecting to registration page.");
            res.status(302).json({
              success: false,
              message: "Create your account before Login",
              redirectUrl: "/doctor/register"
            });
            
            }
          else{
            if(!ExistingDoctor.isBlocked){
    
            
              const role = ExistingDoctor.role;
              const id = ExistingDoctor._id;
              const accesstoken = await this.JWT.accessToken({ id, email, role });
              const refreshToken = await this.JWT.refreshToken({ id, email, role });
              console.log(accesstoken, "-----", refreshToken);
      
              res
                .status(200)
                .cookie("accessToken", accesstoken, { httpOnly: true })
                .cookie("refreshToken", refreshToken, { httpOnly: true })
                .json({
                  success: true,
                  message: "Logging in with GOOGLE Account",
                  user: ExistingDoctor,
                });
              }else{
                res
                .status(200)
                
                .json({
                  success: false,
                  message: "User Blocked",
                  user: ExistingDoctor,
                });
              }
    
          }
          
           
        } catch (error: any) {
            throw error;
        }
    }


      
  async logout(req: Request, res: Response) {
    try {
      console.log("Doctor logged out");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).send({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).send({ success: false, message: "Logout failed. Please try again." });
    }
  }


      
      public async resendOtp(req: Request, res: Response): Promise<any> {
        try {
          let { email} = req.body;
          console.log(email, "emaillllll");
    
          const otp = await this.otpGenerate.createOtpDigit();
          await Promise.all([
            this.otpService.createOtp(email, otp),
            // await this.sendEmail.SendEmailVerification(email, otp)
    
            produce('send-otp-email',{email,otp})
          ]);
          res.status(200).json({
            success: true,
            message: "Otp Sent to Email Succesfully!",
          });
        } catch (error: any) {
          throw error;
        }
      }


      async verifyEmail(req: Request, res: Response) {
        try {
          const { email } = req.body;
          let existingUser = await this.doctorService.findByEmail(email);
          console.log(existingUser,"existingUser")
          if (existingUser) {
            const otp = await this.otpGenerate.createOtpDigit();
            await this.otpService.createOtp(email, otp);
    
            // await this.SentForgotEmail.SendEmailVerification(email, otp);
            produce('send-forgotPassword-email',{email,otp})

            res.send({
              success: true,
              message: "Redirecting To OTP Page",
              data:existingUser
            });
          }else{
            res.send({
              success: false,
              message: "No User Found",
            });
          }
        } catch (error: any) {
          throw error;
        }
      }



      async verifyResetOtp(req:Request,res:Response){
        try {
          const { email, otp }=req.body
          const resultOtp = await this.otpService.findOtp(email);
          console.log(resultOtp?.otp, "<>", otp);
          if (resultOtp?.otp === otp) {
            console.log("matched");
            let token= await this.JWT.createToken({email})
             res.status(200)
            .cookie("forgotToken",token)
            .json({
              success:true,
              message:"Redirecting to Reset Password Page",
            })
          }else{
             res.json({
              success:false,
              message:"Invalid OTP !"
            })
          }
    
          
        } catch (error) {
          throw error
          
        }
      }


      public async forgotResendOtp(req: Request, res: Response): Promise<any> {
        try {
          let { email } = req.body;
          console.log(email, "emaillllll");
    
          const otp = await this.otpGenerate.createOtpDigit();
          await this.otpService.createOtp(email, otp);
    
          // await this.SentForgotEmail.SendEmailVerification(email, otp);
          produce('send-forgotPassword-email',{email,otp})
    
          res.status(200).json({
            success: true,
            message: "Otp Sent to Email Succesfully!",
          });
        } catch (error: any) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
          });
        }
      }


        async resetPassword(req:Request,res:Response){
          try {
            const { password }=req.body
            console.log("new pwd :" , password)
            const hashedPassword= await bcrypt.hash(password,10)
            console.log("hp",hashedPassword)
            console.log("reset password :" ,req.cookies.forgotToken)
            const token=req.cookies.forgotToken
            let data=await this.JWT.verifyToken(token)
            if(!data){
              throw new Error("Token expired retry reset password")
            }
            console.log("email to rsetpwd",data.email)
            const passwordReset= await this.doctorService.resetPassword(data.email,hashedPassword)
            if(passwordReset){

              await produce('password-reset-doctor',passwordReset)
              
              res.clearCookie('forgotToken')
              res.status(200).json({
                success:true,
                message:"Password changed !",
              })
            }
            
          } catch (error) {
            throw error
            
          }
        }




        async updatePassword(data: { email: string; password: string }): Promise< void > {
          try {
            console.log(data.email, data.password, "consumeeeeee");
            const passwordReset = await this.doctorService.resetPassword(
              data.email,
              data.password
            );
           
          } catch (error) {
            console.log(error);
            throw error
          }
        }
        


      
}