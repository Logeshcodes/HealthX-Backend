import { Request, Response } from "express";
import bcrypt from "bcrypt";

import DoctorService from "../services/DoctorService";
import { OtpGenerate } from "../utils/otpGenerator";
import { otpService } from "../services/otpService";
import SendEmail from "../utils/sentEmail";
import JwtService from "../utils/jwt";
import { access_token_options  , refresh_token_options} from "../utils/tokenOptions";

import { SendForgotPasswordEmail } from "../utils/sendForgotPasswordEmail";

import produce from "../config/kafka/producer";

export default class DoctorController {

    private doctorService: DoctorService;
    private otpService: otpService;
    private otpGenerate: OtpGenerate;
    private sendEmail: SendEmail;
    private JWT: JwtService;
    private SentForgotEmail:SendForgotPasswordEmail


    constructor() {
        this.doctorService = new DoctorService();
        this.otpService = new otpService();
        this.otpGenerate = new OtpGenerate();
        this.sendEmail = new SendEmail();
        this.SentForgotEmail=new SendForgotPasswordEmail()
        this.JWT = new JwtService();
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
      
            await this.sendEmail.SendEmailVerification(email, otp);
      
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
                message: "User Logged Successfully",
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



      async logout(req: Request, res: Response) {
        try {
          console.log("user logged out");
          res.clearCookie("accessToken");
          res.clearCookie("refreshToken");
    
          res.status(200).send({ success: true, message: "logout success" });
        } catch (error: any) {
          throw error;
        }
      }


      
      public async resendOtp(req: Request, res: Response): Promise<any> {
        try {
          let { email ,username} = req.body;
          console.log(email, "emaillllll");
    
          const otp = await this.otpGenerate.createOtpDigit();
          await Promise.all([
            this.otpService.createOtp(email, otp),
            await this.sendEmail.SendEmailVerification(email, otp)
    
            // produce('send-otp-email',{name:username,email,otp})
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
    
            await this.SentForgotEmail.SendEmailVerification(email, otp);
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
    
          await this.SentForgotEmail.SendEmailVerification(email, otp);
    
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




        async updatePassword(data: { email: string; password: string }) {
          try {
            console.log(data.email, data.password, "consumeeeeee");
            const passwordReset = await this.doctorService.resetPassword(
              data.email,
              data.password
            );
            return passwordReset;
          } catch (error) {
            console.log(error);
          }
        }
        
        async updateProfile(data: any) {
          try {
            const { email ,username, profilePicUrl} = data;
            console.log(data, "consumeeee");
            const response=await this.doctorService.updateProfile(email,{username, profilePicUrl})
          } catch (error) {
            console.log(error);
          }
        }
        
        async blockDoctor(data:any){
          try {
            const {email,isBlocked}=data
            const response=await this.doctorService.updateProfile(email,{isBlocked})
          } catch (error) {
            console.log(error)
          }
        }

      async getDoctors (req: Request, res: Response): Promise<any> {
        try {
            const doctors = await this.doctorService.getDoctors();
            res.status(201).json(doctors)
        } catch (error) {
          
        }
      }
}