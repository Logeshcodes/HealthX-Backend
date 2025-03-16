import { Request, Response } from "express";
import { IAdminService } from "../services/interface/IAdminService";
import { IAdminController } from "./interface/IAdminController";
import mongoose from "mongoose";
import AppointmentModel from "../models/appointmentModel";
import { StatusCode } from '../utils/enum';
import { ResponseError } from '../utils/constants';

export class AdminController implements IAdminController {

   


    public async totalAppointmentDetails(req: Request, res: Response): Promise<void> {
        try {

            const allAppointments = await AppointmentModel.find()
            const count = await AppointmentModel.countDocuments()

            console.log(" allAppointments:", allAppointments); 

            res.json({
                success: true,
                message: ResponseError.APPOINTMENT_FETCHED_SUCCESS,
                data: allAppointments,
                totalCount : count 
            });
        } catch (error) {
            console.error("Error fetching appointment details:", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: ResponseError.INTERNAL_SERVER_ERROR,
            });
        }
    }


    public async generateRevenueData(req: Request, res: Response): Promise<void> {
        try {
          const timeFilter = req.query.timeFilter as "day" | "month" | "year";
          
          if (!timeFilter) {
            res.status(400).json({ error: "Time filter is required" });
            return;
          }
    
          let groupByFormat: string;
          switch (timeFilter) {
            case "day":
              groupByFormat = "%Y-%m-%d"; // Group by day
              break;
            case "month":
              groupByFormat = "%Y-%m"; // Group by month
              break;
            case "year":
              groupByFormat = "%Y"; // Group by year
              break;
            default:
              res.status(400).json({ error: "Invalid time filter" });
              return;
          }
    
          const revenueData = await AppointmentModel.aggregate([
            {
              $match: { paymentStatus: "Completed" }, // Only include successful payments
            },
            {
              $group: {
                _id: { $dateToString: { format: groupByFormat, date: "$createdAt" } },
                totalRevenue: { $sum: "$amount" },
              },
            },
            {
              $sort: { _id: 1 }, // Sort by date
            },
          ]);
    
          res.status(200).json(revenueData);
        } catch (error) {
          console.error("Error generating revenue data:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    




    
}