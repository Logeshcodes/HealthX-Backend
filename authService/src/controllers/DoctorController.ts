import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { OtpGenerate } from "../utils/otpGenerator";
import JwtService from "../utils/jwt";

import IDoctorControllers from "./interface/IDoctorController";
import IDoctorServices from "../services/interfaces/IDoctorService";
import IOtpServices from "../services/interfaces/IOtpService";

import { ResponseError } from "../utils/constants";
import { StatusCode } from "../utils/enum";

import produce from "../config/kafka/producer";
import { errorCode } from "aws-sdk/clients/ivs";

export default class DoctorController implements IDoctorControllers {
  private doctorService: IDoctorServices;
  private otpService: IOtpServices;

  private otpGenerate: OtpGenerate;
  private JWT: JwtService;

  constructor(doctorService: IDoctorServices, otpService: IOtpServices) {
    this.doctorService = doctorService;
    this.otpService = otpService;
    this.otpGenerate = new OtpGenerate();
    this.JWT = new JwtService();
  }

  public async doctorSignUp(req: Request, res: Response): Promise<any> {
    try {
      let {name,email,password,Mobile,department, gender,consultationType,education,experience,description,} = req.body;

      console.log("Doctor Signup Data:",name,email,password,Mobile,department, gender,consultationType,education,experience,description);

      const hashedPassword = await bcrypt.hash(password, 10);

      const ExistingDoctor = await this.doctorService.findByEmail(email);

      console.log(ExistingDoctor, "ExistingDoctor");

      if (ExistingDoctor) {
        return res.json({
          success: false,
          message: ResponseError.EXISTING_USER,
          user: ExistingDoctor,
        });
      } else {
        const otp = await this.otpGenerate.createOtpDigit();
        await this.otpService.createOtp(email, otp);
        produce("send-otp-email", { email, otp });

        const JWT = new JwtService();
        const tokenPayload = {
          name,
          email,
          hashedPassword,
          Mobile,
          department,
          gender,
          consultationType,
          education,
          experience,
          description,
          role: "Doctor",
        };

        const token = await JWT.createToken(tokenPayload);

        return res.status(StatusCode.CREATED).json({
          success: true,
          message: ResponseError.SIGNUP_SUCCESS,
          token,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async resendOtp(req: Request, res: Response): Promise<any> {
    try {
      let { email } = req.body;
      console.log(email, "emaillllll");

      const otp = await this.otpGenerate.createOtpDigit();
      await Promise.all([
        this.otpService.createOtp(email, otp),

        produce("send-otp-email", { email, otp }),
      ]);
      res.status(StatusCode.OK).json({
        success: true,
        message: ResponseError.OTP_RESENDED,
      });
    } catch (error) {
      throw error;
    }
  }

  public async createUser(req: Request, res: Response): Promise<any> {
    try {
      const { otp } = req.body;
      console.log(req.file, "reqqq");
      console.log(req.headers, "headersssss");
      const token = req.headers["the-verify-token"] || "";
      console.log(token, "token");
      if (typeof token != "string") {
        throw new Error();
      }

      const decode = await this.JWT.verifyToken(token);
      console.log("decode Token data : ", decode);

      if (!decode) {
        return new Error("token has expired, register again");
      }

      const resultOtp = await this.otpService.findOtp(decode.email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
        console.log("matched");
        console.log("decode???", decode);

        const user = await this.doctorService.createUser(decode);
        if (user) {
          await produce("add-doctor", user);
          await this.otpService.deleteOtp(user.email);

          return res.status(StatusCode.CREATED).json({
            success: true,
            message: ResponseError.ACCOUNT_CREATED,
            user,
          });
        }
      } else {
        return res.json({
          success: false,
          message: ResponseError.WRONG_OTP,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      const doctor = await this.doctorService.findByEmail(email);

      if (!doctor) {
        return res.json({
          success: false,
          message: ResponseError.INVAILD_EMAIL,
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
          message: ResponseError.INVAILD_PASSWORD,
        });
      }

      if (doctor.status === "blocked") {
        console.log(" blocked...");
        return res.json({
          success: false,
          message: ResponseError.ACCOUNT_BLOCKED,
        });
      }

      let role = doctor.role;
      const accesstoken = await this.JWT.accessToken({ email, role });
      const refreshToken = await this.JWT.refreshToken({ email, role });

      return res
        .status(StatusCode.OK)
        .cookie("accessToken2", accesstoken, { httpOnly: true })
        .cookie("refreshToken2", refreshToken, { httpOnly: true })
        .send({
          success: true,
          message: ResponseError.ACCOUNT_LOGIN_SUCCESS,
          user: doctor,
        });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async doGoogleLogin(req: Request, res: Response) {
    try {
      console.log("Google login in controller", req.body);

      const { email } = req.body;
      const ExistingDoctor = await this.doctorService.findByEmail(email);
      if (!ExistingDoctor) {
        console.log("Doctor does not exist. Redirecting to registration page.");
        res.status(StatusCode.REDIRECT).json({
          success: false,
          message: ResponseError.CREATE_ACCOUNT,
          redirectUrl: "/doctor/register",
        });
      } else {
        if (!ExistingDoctor.isBlocked) {
          const role = ExistingDoctor.role;
          const id = ExistingDoctor._id;
          const accesstoken = await this.JWT.accessToken({ id, email, role });
          const refreshToken = await this.JWT.refreshToken({ id, email, role });
          console.log(accesstoken, "-----", refreshToken);

          res
            .status(StatusCode.OK)
            .cookie("accessToken2", accesstoken, { httpOnly: true })
            .cookie("refreshToken2", refreshToken, { httpOnly: true })
            .json({
              success: true,
              message: ResponseError.GOOGLE_LOGIN,
              user: ExistingDoctor,
            });
        } else {
          res.status(StatusCode.ACCESS_FORBIDDEN).json({
            success: false,
            message: ResponseError.ACCOUNT_BLOCKED,
            user: ExistingDoctor,
          });
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async logout(req: Request, res: Response) {
    try {
      console.log("Doctor logged out");
      res.clearCookie("accessToken2");
      res.clearCookie("refreshToken2");
      res
        .status(StatusCode.OK)
        .send({ success: true, message: ResponseError.ACCOUNT_LOGOUT });
    } catch (error) {
      console.error("Error during logout:", error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ success: false, message: ResponseError.INTERNAL_SERVER_ERROR });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      let existingUser = await this.doctorService.findByEmail(email);
      console.log(existingUser, "existingUser");
      if (existingUser) {
        const otp = await this.otpGenerate.createOtpDigit();
        await this.otpService.createOtp(email, otp);

        produce("send-forgotPassword-email", { email, otp });

        res.send({
          success: true,
          message: ResponseError.OTP_REDIRECT,
          data: existingUser,
        });
      } else {
        res.send({
          success: false,
          message:ResponseError.USER_NOT_FOUND,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  public async forgotResendOtp(req: Request, res: Response): Promise<any> {
    try {
      let { email } = req.body;
      console.log(email, "emaillllll");

      const otp = await this.otpGenerate.createOtpDigit();
      await this.otpService.createOtp(email, otp);

      produce("send-forgotPassword-email", { email, otp });

      res.status(StatusCode.OK).json({
        success: true,
        message: ResponseError.OTP_RESENDED,
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }


  async verifyResetOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const resultOtp = await this.otpService.findOtp(email);
      console.log(resultOtp?.otp, "<>", otp);
      if (resultOtp?.otp === otp) {
        console.log("matched");
        let token = await this.JWT.createToken({ email });
        res.status(StatusCode.OK).cookie("forgotToken", token).json({
          success: true,
          message: ResponseError.RESET_PASSWORD,
        });
      } else {
        res.json({
          success: false,
          message: ResponseError.WRONG_OTP,
        });
      }
    } catch (error) {
      throw error;
    }
  }


  async resetPassword(req: Request, res: Response) {
    try {
      const { password } = req.body;
      console.log("new pwd :", password);
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("hp", hashedPassword);
      console.log("reset password :", req.cookies.forgotToken);
      const token = req.cookies.forgotToken;
      let data = await this.JWT.verifyToken(token);
      if (!data) {
        throw new Error("Token expired retry reset password");
      }
      console.log("email to rsetpwd", data.email);
      const passwordReset = await this.doctorService.resetPassword(
        data.email,
        hashedPassword
      );
      if (passwordReset) {
        await produce("password-reset-doctor", passwordReset);

        res.clearCookie("forgotToken");
        res.status(StatusCode.OK).json({
          success: true,
          message: ResponseError.RESET_PASSWORD_SUCCESS,
        });
      }
    } catch (error) {
      throw error;
    }
  }



  // - Kafka Consume

  async updatePassword(data: {email: string;password: string}): Promise<void> {

    try {
      console.log(data.email, data.password, "consumeeeeee");
      await this.doctorService.resetPassword(data.email, data.password);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateProfile(data: { email: string; profilePicture: string }) {
    try {
      const { email, profilePicture } = data;
      console.log(data, "consumeeee....");
      await this.doctorService.updateProfile(email, profilePicture);
    } catch (error) {
      console.log(error);
    }
  }

  async blockDoctor(data: {email: string;isBlocked: boolean}): Promise<void> {
    try {
      const { email, isBlocked } = data;
      console.log(data, "consumeeee....");
      await this.doctorService.blockDoctor(email, isBlocked);
    } catch (error) {
      console.log(error);
    }
  }
}
