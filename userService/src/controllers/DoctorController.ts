import DoctorModel, { DoctorInterface } from "../models/doctorModel";
import { Request, Response } from "express";
import { uploadToS3Bucket } from "../utils/s3Bucket";
import bcrypt from "bcrypt";
import produce from "../config/kafka/producer";
import JwtService from "../utils/jwt";
import { SlotInterface } from "../models/slotModel";
import SlotModel from "../models/slotModel";
import { IDoctorController } from "./interface/IDoctorController";
import { IDoctorService } from "../services/interface/IDoctorService";

import { StatusCode } from "../utils/enum";
import { ResponseError } from "../utils/constants";
import { WalletData } from "../types/walletType";

export class DoctorController implements IDoctorController {
  private doctorService: IDoctorService;
  constructor(doctorService: IDoctorService) {
    this.doctorService = doctorService;
  }

  public async addDoctor(payload: DoctorInterface): Promise<void> {
    await this.doctorService.createDoctor(payload);
  }

  async passwordReset(data: any): Promise<void> {
    const { password, email } = data;
    await this.doctorService.updatePassword(email, password);
  }

  async updateWalletCancelAppointmnet(data: WalletData): Promise<void> {
    try {
      console.log("update- doctor wallet data", data);
      const {  doctorId, appointmentId, transactionId, amount, type } = data;

      if (!doctorId) {
        throw new Error("Doctor ID is required");
      }

      const doctorDetails = await DoctorModel.findById({ _id: doctorId });

      if (!doctorDetails) {
        throw new Error("No doctor details not found");
      }
      const transactions = doctorDetails?.wallet.transactions ?? [];
      const description = `Cancelled Appointment Id : ${appointmentId}`;
      const refundAmount = type === "credit" ? amount * 0.1 : amount;

      const newTransaction = {amount: refundAmount,description,transactionId, type, date: new Date()};

      const newBalance =
        type === "debit"
          ? doctorDetails.wallet.balance - amount
          : doctorDetails.wallet.balance + refundAmount;

      const walletDetails = {
        balance: newBalance,
        transactions: [...transactions, newTransaction],
      };

      console.log("Updated Wallet Data:", walletDetails);

      await this.doctorService.updateWallet( doctorId, walletDetails);
    } catch (error) {
      console.log(error);
    }
  }

  async updateWalletBookAppointment(data: WalletData): Promise<void> {
    try {
      console.log("update- doctor wallet data", data);
      const { doctorId , appointmentId, transactionId, amount, type } = data;

      if (!doctorId) {
        throw new Error("Doctor ID is required");
      }

      const doctorDetails = await DoctorModel.findById({ _id: doctorId });

      if (!doctorDetails) {
        throw new Error("No doctor details not found");
      }
      const transactions = doctorDetails?.wallet.transactions ?? [];
      const description = `Booked Appointment Id : ${appointmentId}`;
      const Amount = type === "credit" ? amount  : amount* 0.1;

      const newTransaction = {amount: Amount,description,transactionId, type, date: new Date()};

      const newBalance =
        type === "debit"
          ? doctorDetails.wallet.balance - amount
          : doctorDetails.wallet.balance + Amount;

      const walletDetails = {
        balance: newBalance,
        transactions: [...transactions, newTransaction],
      };

      console.log("Updated Wallet Data:", walletDetails);

      await this.doctorService.updateWallet( doctorId, walletDetails);
    } catch (error) {
      console.log(error);
    }
  }


  public async getDoctor(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      let response = await this.doctorService.getDoctorData(email);
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<any> {
    try {
      const {name, Mobile, email, department, education, experience, consultationType, description, consultationFee, doctorProfileData, location,
      } = req.body;

      let profilePicture;
      let response;

      if (req.file) {
        profilePicture = await uploadToS3Bucket(req.file, "doctorsProfile");

        response = await this.doctorService.updateProfile(email, { name, Mobile, profilePicture, department,education,experience,
          consultationType,description,consultationFee, doctorProfileData,location,
        });

      } else {
        console.log("without profile pic");
        response = await this.doctorService.updateProfile(email, {name, Mobile, department,education,experience,
          consultationType,description,consultationFee, doctorProfileData,location,
        });
      }

      if (response) {
        await produce("update-profile-doctor", { email, profilePicture: profilePicture, location });
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
    }
  }

  public async updatePassword(req: Request, res: Response): Promise<any> {
    try {
      const { currentPassword, newPassword } = req.body;
      const jwtService = new JwtService();
      const tokenData = await jwtService.verifyToken( req.cookies["accessToken2"] );

      if (!tokenData) {
        throw new Error(ResponseError.EXPIRED_JWT);
      }
      let email = tokenData.email;
      const response = await this.doctorService.getDoctorData(email);
      if (!response) {
        throw new Error(ResponseError.USER_NOT_FOUND);
      }

      const oldPassword = response?.hashedPassword;

      const result = await bcrypt.compare(currentPassword, oldPassword);
      if (result) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const response = await this.doctorService.updatePassword( email, hashedPassword );
        if (response) {
          await produce("update-password-doctor", { email, password: hashedPassword,});
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

  public async getDoctors(req: Request, res: Response) {
    try {
      const Doctors = await this.doctorService.getDoctors();
      res.status(StatusCode.OK).json({ users: Doctors});
    } catch (error) {
      console.log(error);
    }
  }

  public async blockDoctor(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const DoctorData = await this.doctorService.getDoctorData(email);

      if (!DoctorData) {
        throw new Error(ResponseError.USER_NOT_FOUND);
      }
      const isBlocked = !DoctorData?.isBlocked;

      const DoctorStatus = await this.doctorService.updateProfile(email, {isBlocked,});
      await produce("block-doctor", { email, isBlocked });

      if (DoctorStatus?.isBlocked) {
        res.status(StatusCode.OK).json({
          success: true,
          message: ResponseError.ACCOUNT_BLOCKED,
        });
      } else {
        res.status(StatusCode.OK).json({
          success: true,
          message: ResponseError.ACCOUNT_UNBLOCKED,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async findAllBanners(req: Request, res: Response): Promise<void> {
    try {
      const banners = await this.doctorService.findAllBanners();
      res.status(StatusCode.OK).json({ banners: banners});
    } catch (error) {
      console.log(error);
    }
  }

  async VerificationRequest( data: any): Promise<DoctorInterface | null | undefined> {
    try {
      const { emailID, status, medicalLicenseUrl, degreeCertificateUrl } = data;

      console.log( emailID, status, medicalLicenseUrl,degreeCertificateUrl, "coming...");
      const response = await this.doctorService.VerificationRequest(emailID,status, medicalLicenseUrl, degreeCertificateUrl );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async createSlot(payload: SlotInterface): Promise<void> {
    try {
      const slot = await SlotModel.create(payload);
    } catch (error) {
      console.error("Error creating slot:", error);
    }
  }

  async removeSlot(payload: SlotInterface): Promise<void> {
    try {
      const { _id } = payload;
      const slot = await SlotModel.findOneAndDelete({ _id: _id });
    } catch (error) {
      console.error("Error creating slot:", error);
    }
  }
}
