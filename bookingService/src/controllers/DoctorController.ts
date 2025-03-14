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
import PrescriptionModel from "../models/prescriptionModel";

export class DoctorController implements IDoctorController {

    private doctorService: IDoctorService;

    constructor(doctorService :IDoctorService) {
      this.doctorService = doctorService
    }

    // kafka 

    public async addDoctor(payload: DoctorInterface): Promise<void> {
      await this.doctorService.createDoctor(payload);
    }
    
    async updateProfile(data:{ email: string; profilePicture: string , location : string }){
        const { email , profilePicture , location } = data;
        await this.doctorService.updateProfile(email, profilePicture , location);
    }

    
    public async slotBooking(req: Request, res: Response): Promise<any> {
      try {
          const { name, email, date, day, timeSlot, mode } = req.body;
          const existingSlot = await SlotModel.findOne({ date, timeSlot });
  
          if (existingSlot) {
              return res.json({
                  success: false,
                  message: ResponseError.SLOT_EXIST,
              });
          }

          let response = await this.doctorService.createSlot({ email, name, date, day, timeSlot, mode });
  
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
          return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ResponseError.INTERNAL_SERVER_ERROR });
      }
  }
  
   

      public async deleteSlot(req: Request, res: Response): Promise<any> {
        try { 
           const { id } = req.params;
    
           let response = await this.doctorService.deleteSlot(id);
    
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
      
          let response = await this.doctorService.getSlotBooking(email);
      
          if (response) {
            res.json({
              success: true,
              message: ResponseError.RESOURCE_FOUND,
              data: response,
            });
          } else {
            res.status(StatusCode.NOT_FOUND).json({
              success: false,
              message: ResponseError.NOT_FOUND,
            });
          }
        } catch (error) {
          res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ResponseError.INTERNAL_SERVER_ERROR ,
          });
        }
      }

      public async getAppointmentById(req: Request, res: Response): Promise<void>{

          try {

            const { appointmentId } = req.params;

          const response = await AppointmentModel.findById({_id: appointmentId});

          if (response) {
            res.json({
              success: true,
              message: ResponseError.RESOURCE_FOUND,
              data: response,
            });
          } else {
            res.status(StatusCode.NOT_FOUND).json({
              success: false,
              message: ResponseError.NOT_FOUND,
            });
          }
            
          } catch (error) {

            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: ResponseError.INTERNAL_SERVER_ERROR ,
            });
          }

      }



      public async addPrescription(req: Request, res: Response): Promise<void> {
        try {
          const { doctorId, patientId, appointmentId, prescriptionDate, medications, diagnosis, notes } = req.body;


          console.log("addPrescription : ",doctorId, patientId, appointmentId, prescriptionDate, medications, diagnosis, notes )
    
          // Validate required fields
          if (!doctorId || !patientId || !appointmentId || !prescriptionDate || !medications.length) {
            res.status(StatusCode.BAD_REQUEST).json({
              success: false,
              message: "Missing required fields.",
            });
            return;
          }
    
  
          const newPrescription = await PrescriptionModel.create({
            doctorId,
            patientId,
            appointmentId,
            prescriptionDate,
            medications,
            diagnosis,
            notes,
          });
    
          res.status(StatusCode.CREATED).json({
            success: true,
            message: ResponseError.PRESCRIPTION_ADDED,
            data: newPrescription,
          });
        } catch (error) {
          console.error("Error adding prescription:", error);
    
          res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ResponseError.INTERNAL_SERVER_ERROR,
          });
        }
      }
    

      public async getAllAppointmentDetails(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { page, limit, activeTab } = req.query;
    
            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(StatusCode.NOT_FOUND).json({ success: false, message: ResponseError.NOT_FOUND });
                return;
            }
    
            console.log(`Fetching appointments for doctor ID: ${id} - Page: ${page}, Limit: ${limit}, activeTab: ${activeTab}`);
    
            const pageNum = Math.max(Number(page) || 1, 1);
            const limitNum = Math.max(Number(limit) || 10, 1);
            const skip = (pageNum - 1) * limitNum;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            const baseQuery: any = { doctorId: new mongoose.Types.ObjectId(id) };
    
            // Fetch appointment details with date from timeslots
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
    
            console.log("Intermediate allAppointments:", allAppointments); 
    
            // Calculate stats
            const stats = await AppointmentModel.aggregate([
                { $match: { doctorId: new mongoose.Types.ObjectId(id) } },
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
    
            console.log("Response:", {
                allAppointments,
                totalAppointments,
                todayCount,
                completedCount,
                totalEarnings,
            });
    
            res.json({
                success: true,
                message: ResponseError.APPOINTMENT_FETCHED_SUCCESS,
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
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: ResponseError.INTERNAL_SERVER_ERROR,
            });
        }
    }
      
      
      
 
      

}