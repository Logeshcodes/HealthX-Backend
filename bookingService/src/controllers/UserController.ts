import SlotModel, { SlotInterface } from "../models/slotModel";
import { IUserController } from "./interface/IUserController";
import { Request, Response } from "express";
import { IUserService } from "../services/interface/IUserService";
import AppointmentModel from "../models/appointmentModel";
import { UserInterface } from "../models/userModel";
import mongoose from "mongoose";
import produce from "../config/kafka/producer";

import { StatusCode } from "../utils/enum";
import { ResponseError } from "../utils/constants";


export class UserController implements IUserController {

  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  // kafka 

  public async addUser(payload: UserInterface): Promise<void> {
      await this.userService.createUser(payload);
  }

  public async updateProfile(data: { email: string; profilePicture: string }) {
      const {email , profilePicture} = data ;
      await this.userService.updateProfile(email, profilePicture);
  }

  public async updateSlot(payload: SlotInterface): Promise<void> {
    const { _id } = payload;
    await SlotModel.findByIdAndUpdate(_id,{ $set: { avaliable: true } },{ new: true });
  }


  public async getSlotBooking(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const { page = 1, limit = 4 } = req.query;

      console.log(`Fetching slots for email: ${email} - Page: ${page}, Limit: ${limit}`);
      const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
      const limitNum = Math.max(parseInt(limit as string, 10) || 4, 1);
      const skip = (pageNum - 1) * limitNum;

      const response = await this.userService.getSlotBooking( email, skip, limitNum );

      if (response) {
        const totalSlots = await SlotModel.countDocuments({ email: email });
        console.log("ans", response, totalSlots, pageNum);

        res.json({
          success: true,
          message: ResponseError.SLOT_DATA_FETCHED,
          data: response,
          total: totalSlots,
          page: pageNum,
          totalPages: Math.ceil(totalSlots / limitNum),
        });
      } else {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.SLOT_NOTFOUND,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  public async getSlotDetailsById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const response = await this.userService.getSlotDetailsById(id);

      if (response) {
        res.json({
          success: true,
          message: ResponseError.SLOT_DATA_FETCHED,
          data: response,
        });
        return;
      } else {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.SLOT_NOTFOUND,
        });
      }
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async walletPayment(req: Request, res: Response): Promise<any> {

    try {
      const { slotId, doctorId, patientId, paymentId, amount } =req.body.appointmentData;

      const slot = await SlotModel.findById(slotId);
      if (!slot) {
        return res.status(StatusCode.NOT_FOUND).json({ error: ResponseError.SLOT_NOTFOUND });
      }

      await SlotModel.findByIdAndUpdate(slotId,
        { $set: { avaliable: false } },
        { new: true }
      );

      const appointment = new AppointmentModel({
        slotId: slotId,
        patientId: patientId,
        doctorId: doctorId,
        paymentId: paymentId,
        amount: amount,
        paymentStatus: "success",
        paymentMethod : "Wallet",
        appointmentDate: slot.date,
      });

      const response = await appointment.save();

      if (response) {
        res.json({
          success: true,
          message: "Appointment Booked Successfully...",
          data: response,
        });
        await produce("wallet-payment-user", {
          appointmentId: appointment._id,
          transactionId: appointment?.paymentId,
          amount: appointment?.amount,
          userId: patientId,
          type: "debit",
        });
        return;
      } else {
        res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: ResponseError.NOT_FOUND,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ResponseError.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async paymentSuccess(req: Request, res: Response): Promise<any> {
    try {
      console.log("Received Request Body:", req.body);

      const { txnid, amount,productinfo, firstname, email, udf1, udf2,  phone,  status,} = req.body;

      const slot = await SlotModel.findById(productinfo);
      if (!slot) {
        return res.status(StatusCode.NOT_FOUND).json({ error: ResponseError.NOT_FOUND});
      }

      await SlotModel.findByIdAndUpdate(productinfo, { $set: { avaliable: false } }, { new: true });

      const appointment = new AppointmentModel({
        slotId: productinfo,
        patientId: udf1,
        doctorId: udf2,
        paymentId: txnid,
        amount: amount,
        paymentStatus: status,
        appointmentDate: slot.date,
      });

      await appointment.save();

      res.redirect(
        `http://localhost:3000/user/patient/payment-success/${txnid}`
      );
    } catch (error) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: ResponseError.PAYMENT_ERROR });
    }
  }

  async paymentFailure(req: Request, res: Response): Promise<any> {
    return res.redirect(`http://localhost:3000/user/patient/payment-failure`);
  }

  async getAppointmentDetails(req: Request, res: Response): Promise<any> {
    try {
      const { txnid } = req.params;

      if (!txnid) {
        return res.status(StatusCode.NOT_FOUND).json({ message: ResponseError.NOT_FOUND });
      }

      const appointment = await AppointmentModel.findOne({ paymentId: txnid });

      if (!appointment) {
        return res.status(StatusCode.NOT_FOUND).json({ message: ResponseError.NOT_FOUND });
      }

      console.log("return appointment", appointment);
      return res.status(StatusCode.OK).json(appointment);
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseError.INTERNAL_SERVER_ERROR });
    }
  }

  public async getAllAppointmentDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page, limit, activeTab } = req.query;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: ResponseError.NOT_FOUND });
        return; // Ensure the function exits after sending the response
      }
  
      console.log(`Fetching appointments for patient ID: ${id} - Page: ${page}, Limit: ${limit}, activeTab: ${activeTab}`);
  
      const pageNum = Math.max(Number(page) || 1, 1);
      const limitNum = Math.max(Number(limit) || 10, 1);
      const skip = (pageNum - 1) * limitNum;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const baseQuery: any = { patientId: new mongoose.Types.ObjectId(id) };
  
      // Fetch appointment details with date from timeslots
      const allAppointments = await AppointmentModel.aggregate([
        { $match: baseQuery },
        {
          $lookup: {
            from: "doctors",
            localField: "doctorId",
            foreignField: "_id",
            as: "doctorDetails",
          },
        },
        {
          $lookup: {
            from: "timeslots",
            localField: "slotId",
            foreignField: "_id",
            as: "slotDetails",
          },
        },
        { $unwind: "$slotDetails" },
        { $unwind: "$doctorDetails" },
        {
          $addFields: {
            appointmentDate: { $toDate: "$slotDetails.date" }, 
          },
        },
        {
          $match: {
            ...(activeTab === "upcoming" && {
              appointmentDate: { $gte: today },
              status: { $ne: "cancelled" },
            }),
            ...(activeTab === "past" && {
              appointmentDate: { $lt: today },
              status: { $ne: "cancelled" },
            }),
            ...(activeTab === "cancelled" && {
              status: "cancelled",
            }),
          },
        },
        { $skip: skip },
        { $limit: limitNum },
    
      ]);
  
      // Calculate stats
      const stats = await AppointmentModel.aggregate([
        { $match: { patientId: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "timeslots",
            localField: "slotId",
            foreignField: "_id",
            as: "slotDetails",
          },
        },
        { $unwind: "$slotDetails" },
        {
          $addFields: {
            appointmentDate: { $toDate: "$slotDetails.date" }, // Use date from timeslots
          },
        },
        {
          $group: {
            _id: null,
            totalAppointments: { $sum: 1 },
            todayCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ["$appointmentDate", today] },
                      { $ne: ["$status", "cancelled"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            completedCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $lt: ["$appointmentDate", today] },
                      { $ne: ["$status", "cancelled"] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            totalEarnings: {
              $sum: {
                $cond: [{ $lt: ["$appointmentDate", today] }, "$amount", 0],
              },
            },
          },
        },
      ]);
  
      const {
        totalAppointments = 0,
        todayCount = 0,
        completedCount = 0,
        totalEarnings = 0,
      } = stats[0] || {};
  
      console.log("Response:", { allAppointments, totalAppointments, todayCount, completedCount, totalEarnings });
  
      res.json({
        success: true,
        data: allAppointments || [],
        total: totalAppointments,
        page: pageNum,
        todayCount,
        completedCount,
        totalEarnings,
        totalPages: Math.ceil(totalAppointments / limitNum),
      });
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ResponseError.INTERNAL_SERVER_ERROR });
    }
  }

  public async cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const status = "cancelled";

      const response = await this.userService.cancelAppointment(id , status);

      const appointment = await AppointmentModel.findByIdAndUpdate(id , {$set : {status :status}});

      const userId = appointment?.patientId.toString();
      const doctorId = appointment?.doctorId.toString();

      await produce("update-cancelAppointment-user-wallet", {
        appointmentId: id,
        transactionId: appointment?.paymentId,
        amount: appointment?.amount,
        userId,
        doctorId,
        type: "credit",
      });

      await produce("update-cancelAppointment-doctor-wallet", {
        appointmentId: id,
        transactionId: appointment?.paymentId,
        amount: appointment?.amount,
        userId,
        doctorId,
        type: "credit",
      });

      if (response) {
        res.status(StatusCode.OK).json({
          success: true,
          message: ResponseError.CANCEL_APPOINTMENT,
        });
      } else {
        res.json({
          success: false,
          message: ResponseError.FAILED_APPOINTMENT,
        });
      }
    } catch (error) {throw error}
  }
}
