import { Request, Response } from "express";

import { SlotInterface } from "../../models/slotModel";
import { UserInterface } from "../../models/userModel";


export interface IUserController {

    // kafka 
    addUser( payload : UserInterface) : Promise<void>;
    updateProfile(data:{ email: string; profilePicture: string }): Promise<void>;
   
    getSlotBooking(req: Request, res: Response): Promise<void>;
    getSlotDetailsById(req: Request, res: Response): Promise < void >;
    walletPayment(req : Request , res : Response): Promise <any> ;
    paymentSuccess(req : Request , res : Response): Promise <any> ;
    paymentFailure(req : Request , res : Response): Promise <any> ;
    getAllAppointmentDetails(req: Request, res: Response): Promise<void> 
    getDoctorDetails( req : Request , res : Response) : Promise <void> ;
    getPrescriptionById( req : Request , res : Response) : Promise <void> ;
    getAppointmentDetails(req :Request , res : Response ) : Promise < any>;
    cancelAppointment(req : Request , res : Response): Promise <any> ;
  
}