import SlotModel, { SlotInterface } from "../models/slotModel";
import { IUserController } from "./interface/IUserController";

import { Request, Response } from "express";

import { IUserService } from "../services/interface/IUserService";
import AppointmentModel from "../models/appointmentModel";
import { UserInterface } from "../models/userModel";
import mongoose from "mongoose";

import produce from "../config/kafka/producer";

export class UserController implements IUserController {
  private userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }

  // kafka - user from auth
  public async addUser(payload: UserInterface): Promise<void> {
    try {
      console.log("in the ontroller ", payload);

      let response = await this.userService.createUser(payload);
      //return response
      console.log("user created =>>>>>>>>>>>", response);
    } catch (error) {
      console.log(error);
    }
  }

  // kafka update from user
  async updateProfile(data: { email: string; profilePicture: string }) {
    try {
      const { email, profilePicture } = data;
      console.log(data, "consumeeee....");
      const response = await this.userService.updateProfile(
        email,
        profilePicture
      );
    } catch (error) {
      console.log(error);
    }
  }

  public async getSlotBooking(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const { page = 1, limit = 4 } = req.query;

      console.log(
        `Fetching slots for email: ${email} - Page: ${page}, Limit: ${limit}`
      );

      // Ensure page and limit are numbers
      const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
      const limitNum = Math.max(parseInt(limit as string, 10) || 4, 1);

      // Calculate the skip and limit
      const skip = (pageNum - 1) * limitNum;

      const response = await this.userService.getSlotBooking(
        email,
        skip,
        limitNum
      );
      // console.log(response);

      if (response) {
        const totalSlots = await SlotModel.countDocuments({ email: email });

        console.log("ans", response, totalSlots, pageNum);

        res.json({
          success: true,
          message: "Slots fetched successfully",
          data: response,
          total: totalSlots,
          page: pageNum,
          totalPages: Math.ceil(totalSlots / limitNum),
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

  public async getSlotDetailsById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log(" slot id", id);

      const response = await this.userService.getSlotDetailsById(id);

      if (response) {
        res.json({
          success: true,
          message: "Slots fetched successfully",
          data: response,
        });
        return;
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

  public async updateSlot(payload: SlotInterface): Promise<void> {
    console.log("load", payload);

    const { _id } = payload;

    try {
      const updateResponse = await SlotModel.findByIdAndUpdate(
        _id,
        { $set: { avaliable: false } },
        { new: true }
      );

      console.log("Successfully updated slot ...", updateResponse);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async walletPayment(req: Request, res: Response): Promise<any>{

      try {

        const {slotId , doctorId , patientId , paymentId , amount  } = req.body.appointmentData ;

        const slot = await SlotModel.findById(slotId);
        if (!slot) {
          return res.status(404).json({ error: "Slot not found" });
        }

        const updateResponse = await SlotModel.findByIdAndUpdate(
          slotId,
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
          appointmentDate: slot.date,
        
        });

        const response = await appointment.save();



        if (response) {
          res.json({
            success: true,
            message: "Appointment Booked Successfully...",
            data: response,
          });
          await produce("wallet-payment-user",{appointmentId : appointment._id , transactionId : appointment?.paymentId  , amount : appointment?.amount , userId : patientId , type : "debit" })
          return;
        } else {
          res.status(404).json({
            success: false,
            message: "Appointment Not Booked",
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

      const {
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        udf1,
        udf2,
        phone,
        status,
      } = req.body;

      const slot = await SlotModel.findById(productinfo);
      if (!slot) {
        return res.status(404).json({ error: "Slot not found" });
      }

      const updateResponse = await SlotModel.findByIdAndUpdate(
        productinfo,
        { $set: { avaliable: false } },
        { new: true }
      );


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
      console.error("Error in paymentSuccess:", error);
      res.status(500).json({ error: "Error processing payment success" });
    }
  }

  async paymentFailure(req: Request, res: Response): Promise<any> {
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

  // get All appointments by email to user :
  public async getAllAppointmentDetails(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { page, limit, activeTab } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid doctor ID" });
        }

        console.log(`Fetching appointments for doctor ID: ${id} - Page: ${page}, Limit: ${limit}, activeTab: ${activeTab}`);

        const pageNum = Math.max(Number(page) || 1, 1);
        const limitNum = Math.max(Number(limit) || 10, 1);
        const skip = (pageNum - 1) * limitNum;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const baseQuery: any = { patientId: new mongoose.Types.ObjectId(id) };

        switch (activeTab) {
            case "upcoming":
                baseQuery.appointmentDate = { $gte: today };
                baseQuery.status = { $ne: "cancelled" };
                break;
            case "past":
                baseQuery.appointmentDate = { $lt: today };
                baseQuery.status = { $ne: "cancelled" };
                break;
            case "cancelled":
                baseQuery.status = "cancelled";
                break;
        }

        console.log("Base Query:", baseQuery);

        // Fetch paginated appointments
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
                  from: "users",
                  localField: "patientId",
                  foreignField: "_id",
                  as: "patientDetails",
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
            { $unwind: "$doctorDetails" },
            { $unwind: "$patientDetails" },
            { $unwind: "$slotDetails" },
            { $skip: skip },
            { $limit: limitNum },
        ]);

        // Aggregation for stats
        const stats = await AppointmentModel.aggregate([
            { $match: { patientId: new mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: null,
                    totalAppointments: { $sum: 1 },
                    todayCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $gte: ["$appointmentDate", today] }, { $ne: ["$status", "cancelled"] }] },
                                1,
                                0,
                            ],
                        },
                    },
                    completedCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $lt: ["$appointmentDate", today] }, { $ne: ["$status", "cancelled"] }] },
                                1,
                                0,
                            ],
                        },
                    },
                    totalEarnings: { $sum: { $cond: [{ $lt: ["$appointmentDate", today] }, "$amount", 0] } },
                },
            },
        ]);

        const {
            totalAppointments = 0,
            todayCount = 0,
            completedCount = 0,
            totalEarnings = 0
        } = stats[0] || {};

        console.log("Response:", { allAppointments, totalAppointments, todayCount, completedCount, totalEarnings });

        res.json({
            success: true,
            message: "Appointments fetched successfully",
            data: allAppointments || [],
            total: totalAppointments,
            page: pageNum,
            todayCount,
            completedCount,
            totalEarnings,
            totalPages: Math.ceil(totalAppointments / limitNum),
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


  public async getAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log(`Fetching appointments for email: ${id}`);

      const response = await this.userService.getAppointment(id);

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



  public async cancelAppointment( req : Request , res : Response) : Promise <void> {

      try {

        const { id } = req.params;

        const response = await this.userService.cancelAppointment(id) ;

        const appointment = await AppointmentModel.findOne({ _id: id });


        const userId = appointment?.patientId.toString() ;
        const doctorId = appointment?.doctorId.toString() ;
 

        await produce("update-cancelAppointment-user-wallet",{appointmentId : id , transactionId : appointment?.paymentId  , amount : appointment?.amount , userId , doctorId , type : "credit" })

        await produce("update-cancelAppointment-doctor-wallet",{appointmentId : id , transactionId : appointment?.paymentId  , amount : appointment?.amount , userId , doctorId , type : "credit" })

        if (response) {
          
          res.status(200).json({
            success: true,
            message: "Appointment Cancel Requested..",
          });
        } else {
          res.json({
            success: false,
            message: "Not Appointment Cancel Requested",
          });
        }
        
      } catch (error) {
        
      }
  }
}
