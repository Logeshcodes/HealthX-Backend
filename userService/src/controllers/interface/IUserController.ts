import { UserInterface } from "../../models/userModel";
import { AppointmentInterface } from "../../models/appointmentModel";

import { Request, Response } from "express";

export interface IUserController{

    addUser( payload : UserInterface) : Promise<void>;
    getUser( req : Request , res : Response) : Promise <void> ;
    updateProfile( req : Request , res : Response) : Promise <void> ;
    updatePassword( req : Request , res : Response) : Promise <void> ;
    getUsers( req : Request , res : Response) : Promise <void> ;
    findAllBanners( req : Request , res : Response) : Promise <void> ;
    findAllDoctors( req : Request , res : Response) : Promise <void> ;
    findAllDepartment( req : Request , res : Response) : Promise <void> ;
    blockUser( req : Request , res : Response) : Promise <void> ;
    passwordReset( data:any): Promise<UserInterface | undefined | null>;


    paymentSuccess(req : Request , res : Response): Promise <any> ;
    paymentFailure(req : Request , res : Response): Promise <any> ;



    getDoctorDetails( req : Request , res : Response) : Promise <void> ;
    getAppointmentDetails(req :Request , res : Response ) : Promise < any>;
    getAllAppointmentDetails(req: Request, res: Response): Promise<void> 
    // stats
    getAppointment(req: Request, res: Response): Promise<void> 

}