import { SlotInterface } from "../models/slotModel";
import { IDoctorController } from "./interface/IDoctorController";

import { Request, Response } from "express";

import { IDoctorService } from "../services/interface/IDoctorService";
import produce from "../config/kafka/producer";


export class DoctorController implements IDoctorController {

    private doctorService: IDoctorService;
    constructor(doctorService :IDoctorService) {
      this.doctorService = doctorService
    }

    public async slotBooking(req: Request, res: Response): Promise<any> {
        try {

           console.log("body" ,req.body)
           const { name , email , date , day , timeSlot , mode} = req.body ;
           let response = await this.doctorService.createSlot({email , name , date , day , timeSlot  , mode});

           console.log("body response" ,response)

          if (response) {


            await produce('add-slot',response)

            return res.json({
              success: true,
              message: "Slot Updated...",
              data : response 
            });
          }else{
            return res.json({
              success: false,
              message: "Slot Not Updated !",
            });
          }

  
        } catch (error) {
          console.log(error);
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
               message: "Slot deleted Successfully...",
               data : response
             });
           } else {
             return res.json({
               success: false,
               message: "Slot Not deleted!",
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
            res.status(404).json({
              success: false,
              message: "Slot Not getting!",
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