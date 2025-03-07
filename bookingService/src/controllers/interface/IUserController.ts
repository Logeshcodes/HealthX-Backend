import { Request, Response } from "express";

import { SlotInterface } from "../../models/slotModel";
import { UserInterface } from "../../models/userModel";


export interface IUserController {

    // kafka add user from auth
    addUser( payload : UserInterface) : Promise<void>;
    // kafka update from user
    updateProfile(data:{ email: string; profilePicture: string }): Promise<void>;

   

   
    getSlotBooking(req: Request, res: Response): Promise<void>;
    getSlotDetailsById(req: Request, res: Response): Promise < void >;
    updateSlot( payload : SlotInterface ) : Promise <void>;

    getAppointmentDetails(req :Request , res : Response ) : Promise < any>;
    cancelAppointment(req : Request , res : Response): Promise <any> ;
    walletPayment(req : Request , res : Response): Promise <any> ;
    paymentSuccess(req : Request , res : Response): Promise <any> ;
    paymentFailure(req : Request , res : Response): Promise <any> ;


    getAllAppointmentDetails(req: Request, res: Response): Promise<void> 
    // stats
    getAppointment(req: Request, res: Response): Promise<void> 
}