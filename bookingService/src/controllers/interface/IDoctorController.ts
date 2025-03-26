import { Request, Response } from "express";


import { DoctorInterface } from "../../models/doctorModel";

export interface IDoctorController {

     // kafka
    addDoctor(payload : DoctorInterface): Promise<void>;
    updateProfile(data:{ email: string; profilePicture: string , location : string } ): Promise<void>;

    slotBooking(req: Request, res: Response ) : Promise <any> ;

    addPrescription(req: Request, res: Response ) : Promise <any> ;
    getPrescriptionById(req: Request, res: Response ) : Promise <any> ;
    deleteSlot(req: Request, res: Response ) : Promise <any> ;
    getSlotBooking(req: Request, res: Response): Promise<void>;
    getAllAppointmentDetails(req: Request, res: Response): Promise<void>  
    getAppointmentById(req: Request, res: Response): Promise<void>  
 
}