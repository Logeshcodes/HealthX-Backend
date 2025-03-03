import { Request, Response } from "express";

import { SlotInterface } from "../../models/slotModel";
import { DoctorInterface } from "../../models/doctorModel";

export interface IDoctorController {

     // kafka add doctor from auth
     addDoctor(payload : DoctorInterface): Promise<void>;

     updateProfile(data:{ email: string; profilePicture: string } ): Promise<void>;

    slotBooking(req: Request, res: Response ) : Promise <any> ;
    deleteSlot(req: Request, res: Response ) : Promise <any> ;
    getSlotBooking(req: Request, res: Response): Promise<void>;


    getAllAppointmentDetails(req: Request, res: Response): Promise<void> 
    getAppointment(req: Request, res: Response): Promise<void> 
 
}