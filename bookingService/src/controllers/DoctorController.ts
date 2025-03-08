import { SlotInterface } from "../models/slotModel";
import { IDoctorController } from "./interface/IDoctorController";

import { Request, Response } from "express";

import SlotModel from "../models/slotModel";
import { DoctorInterface } from "../models/doctorModel";
import AppointmentModel from "../models/appointmentModel";

import { IDoctorService } from "../services/interface/IDoctorService";
import produce from "../config/kafka/producer";
import mongoose from "mongoose";

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
    
    async updateProfile(data:{ email: string; profilePicture: string , location : string } ) {
      try {
        const { email , profilePicture , location } = data;
        console.log(data , "consumeeee....");
        const response=await this.doctorService.updateProfile(email, profilePicture , location)
      } catch (error) {
        console.log(error);
      }
    }

    
    public async slotBooking(req: Request, res: Response): Promise<any> {
      try {
          console.log("body", req.body);
          const { name, email, date, day, timeSlot, mode } = req.body;
  
          
          const existingSlot = await SlotModel.findOne({ date, timeSlot });
  
          if (existingSlot) {
              return res.json({
                  success: false,
                  message: ResponseError.SLOT_EXIST,
              });
          }
  
         
          let response = await this.doctorService.createSlot({ email, name, date, day, timeSlot, mode });
  
          console.log("body response", response);
  
          if (response) {
              await produce('add-slot', response);
  
              return res.json({
                  success: true,
                  message: ResponseError.SLOT_UPDATED,
                  data: response
              });
          } else {
              return res.json({
                  success: false,
                  message: ResponseError.SLOT_NOTFOUND,
              });
          }
  
      } catch (error) {
          console.log(error);
          return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ResponseError.INTERNAL_SERVER_ERROR });
      }
  }
  
   

      public async deleteSlot(req: Request, res: Response): Promise<any> {
        try {
           console.log("params", req.params); 
           const { id } = req.params;
    
           let response = await this.doctorService.deleteSlot(id);
    
           console.log("delete response", response);
    
           if (response) {

            await produce('remove-slot',response)
             return res.json({
               success: true,
               message: ResponseError.SLOT_DELETED,
               data : response
             });
           } else {
             return res.json({
               success: false,
               message: ResponseError.SLOT_NOTFOUND,
             });
           }
        } catch (error) {
           console.log(error);
        }
    }
    





      public async getSlotBooking(req: Request, res: Response): Promise<void> {
        try {
          const { email } = req.params;
          console.log(email, "get email");
      
          let response = await this.doctorService.getSlotBooking(email);
          console.log(response);
      
          if (response) {
            res.json({
              success: true,
              message: "get Slot ...",
              data: response,
            });
          } else {
            res.status(StatusCode.NOT_FOUND).json({
              success: false,
              message: "Slot Not getting!",
            });
          }
        } catch (error) {
          console.error("Error:", error);
          res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ResponseError.INTERNAL_SERVER_ERROR ,
          });
        }
      }



      public async getAllAppointmentDetails(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { page, limit, activeTab } = req.query;
    
            console.log(`Fetching appointments for email: ${id} - Page: ${page}, Limit: ${limit}, activeTab: ${activeTab}`);
    
            const pageNum = Math.max(Number(page) || 1, 1);
            const limitNum = Math.max(Number(limit) || 10);
            const skip = (pageNum - 1) * limitNum;

            console.log("Doctor ID Type:", typeof id, "Value:", id);

            console.log("id...." , id)

    
            const baseQuery: any = { doctorId: new mongoose.Types.ObjectId(id) };
            const today = new Date();
            // today.setHours(0, 0, 0, 0);
    
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
    
            console.log("baseQuery", baseQuery, id);
    
            // Fetch paginated appointments with patient and slot details
            const allAppointments = await AppointmentModel.aggregate([
                { $match: baseQuery },
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
                { $unwind: "$patientDetails" },
                { $unwind: "$slotDetails" },
                { $skip: skip },
                { $limit: limitNum },
            ]);
    
            console.log("all_appointments ....", allAppointments);
    
            // Optimized aggregation query to count total appointments, today’s, completed, and total earnings
            const stats = await AppointmentModel.aggregate([
                { $match: { doctorId: new mongoose.Types.ObjectId(id) } },
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
    
            const { totalAppointments, todayCount, completedCount, totalEarnings } = stats[0] || {
                totalAppointments: 0,
                todayCount: 0,
                completedCount: 0,
                totalEarnings: 0,
            };
    
            console.log("Response:", allAppointments, "Total Appointments:", totalAppointments, "Page:", pageNum);
    
            res.json({
                success: true,
                message: ResponseError.APPOINTMENT_FETCHED_SUCCESS,
                data: allAppointments,
                total: totalAppointments,
                page: pageNum,
                todayCount,
                completedCount,
                totalEarnings,
                totalPages: Math.ceil(totalAppointments / limitNum),
            });
    
        } catch (error) {
            console.error("Error:", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: ResponseError.INTERNAL_SERVER_ERROR,
            });
        }
    }
    
      
      
      
      public async getAppointment(req: Request, res: Response): Promise<void> {
      
        try {
          const { id } = req.params;
          const response = await this.doctorService.getAppointment(id);
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
      

}