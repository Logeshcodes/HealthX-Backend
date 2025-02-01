import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { OtpGenerate } from "../utils/otpGenerator";
import JwtService from "../utils/jwt";
// import SendEmail from "../utils/sentEmail";

import UserServices from "../services/UserService";
import { otpService } from "../services/otpService";

import { UserInterface } from "../models/userModel";

// import { access_token_options , refresh_token_options } from "@/utils/tokenOptions";
// import { SendForgotPasswordEmail } from "../utils/sendForgotPasswordEmail";

import produce from "../config/kafka/producer";


export class UserController {

  private userService: UserServices;
  private otpService: otpService;
  private otpGenerator: OtpGenerate;
  // private sendEmail: SendEmail;
  private JWT: JwtService;
  // private SentForgotEmail:SendForgotPasswordEmail


  constructor() {
    this.userService = new UserServices();
    this.otpService = new otpService();
    this.otpGenerator = new OtpGenerate();
    // this.sendEmail = new SendEmail();
    // this.SentForgotEmail=new SendForgotPasswordEmail()
    this.JWT = new JwtService();
  }


  public async userSignUp(req: Request, res: Response): Promise<any> {
    try {
      let { email, password } = req.body;
      console.log(email, password);

      
      const hashedPassword = await bcrypt.hash(password, 10);
    //   password=hashedPassword
     

      const ExistingUser = await this.userService.findByEmail(
        email
      );

      console.log(ExistingUser, "Existing User");

      if (ExistingUser) {
        return res.json({
          success: false,
          message: "Existing user",
          user: ExistingUser,
        });
       
      } else {
        const otp = await this.otpGenerator.createOtpDigit();
        await Promise.all(
          [
             this.otpService.createOtp(email, otp),
            //  this.sendEmail.SendEmailVerification(email , otp)
            produce('send-otp-email',{email,otp})
          ]
        )
    
        const token = await this.JWT.createToken({
          email,
          hashedPassword,
          role: "User",
        });

      
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


  public async resendOtp(req: Request, res: Response): Promise<any> {
    try {
      let { email } = req.body;

      const otp = await this.otpGenerator.createOtpDigit();
      await Promise.all(
        [
           this.otpService.createOtp(email, otp),

          //  this.sendEmail.SendEmailVerification(email, otp)
          produce('send-otp-email',{email,otp})
        ]
      )

      res.status(200).json({
        success: true,
        message: "Otp Sent to Email Succesfully!",
      });
    } catch (error: any) {
      throw error
    }
  }



  public async createUser(req: Request, res: Response): Promise<any> {
    try {
      const { otp } = req.body;
      console.log("OTP?? : ", otp)
      const token = req.headers["the-verify-token"] || "";
      console.log(token, "token???");
      if (typeof token != "string") {
        throw new Error();
      }
      const decode = await this.JWT.verifyToken(token);
      console.log(decode, "decode User token????");
      if (!decode) {
        return new Error("token has expired, register again");
      }
      const resultOtp = await this.otpService.findOtp(decode.email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
        // console.log("matched");

        const user = await this.userService.createUser(decode);
        
        if (user) {
         await produce('add-user',user)
          await this.otpService.deleteOtp(user.email);

          return res.status(201).json({
            success: true,
            message: "User account successfully created!",
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

      console.log("email , password :", email , password )

      const User = await this.userService.findByEmail(email);
      console.log(User, "User");

      if (!User) {
        return res.json({
          success: false,
          message: "invalid email id",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        User.hashedPassword
      );

      if (User.isBlocked) {
        console.log(" blocked...")
        return res.json({
          success: false,
          message: "User Blocked !",
        });
    
      }

      if (!isPasswordValid) {
        return res.json({
          success: false,
          message: "Invalid Password",
        });
      }
      let role = User.role;
      console.log("isPasswordValid , role :", isPasswordValid , role )
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
            user: User,
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
      console.log("User logged out");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).send({ success: true, message: "logout success" });
    } catch (error: any) {
      throw error;
    }
  }




  async verifyEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      let existingUser = await this.userService.findByEmail(email);
      console.log(existingUser,"existing User")
      if (existingUser) {
        const otp = await this.otpGenerator.createOtpDigit();
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

      const otp = await this.otpGenerator.createOtpDigit();
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
      const passwordReset= await this.userService.resetPassword(data.email,hashedPassword)
      if(passwordReset){


        await produce('password-reset-user',passwordReset)

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




  async doGoogleLogin(req:Request,res:Response) {
    try {
        console.log("Google login in controller", req.body);

        const { name, email, password } = req.body;
        const existingUser=await this.userService.findByEmail(email)
        if(!existingUser){

        

        const user: any = await this.userService.googleLogin(name, email, password);
        console.log(user, "User after creation in controller Google");

        if (user) {
        //   await produce('add-user',user)
            console.log(user.token, "User token");
            const role=user.role
            const accesstoken = await this.JWT.accessToken({ email, role });
      const refreshToken = await this.JWT.refreshToken({ email, role });
      console.log(accesstoken,"-----",refreshToken)
      

            res.status(200)
            .cookie("accessToken", accesstoken,{ httpOnly: true })
            .cookie("refreshToken", refreshToken,{ httpOnly: true })
            .json({
              success:true,
              message:"Logging in with GOOOOGLE",
              user:user
              
            });
        }
      }else{
        const role=existingUser.role
            const accesstoken = await this.JWT.accessToken({ email, role });
      const refreshToken = await this.JWT.refreshToken({ email, role });
      console.log(accesstoken,"-----",refreshToken)
      

            res.status(200)
            .cookie("accessToken", accesstoken,{ httpOnly: true })
            .cookie("refreshToken", refreshToken,{ httpOnly: true })
            .json({
              success:true,
              message:"Logging in with GOOOOGLE",
              user:existingUser
              
            });

      }
       
    } catch (error: any) {
        throw error;
    }
}





  //consumed kafka codes==============


  async updatePassword(data: { email: string; password: string }) {
    try {
      console.log(data.email, data.password, "consumeeeeee");
      const passwordReset = await this.userService.resetPassword(
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
      const response=await this.userService.updateProfile(email,{username, profilePicUrl})
    } catch (error) {
      console.log(error);
    }
  }

  async blockUser(data:any){
    try {
      const {email,isBlocked}=data
      const response=await this.userService.updateProfile(email,{isBlocked})
    } catch (error) {
      console.log(error)
    }
  }



}


