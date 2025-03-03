import { DoctorInterface } from "../../models/doctorModel";
import { SlotInterface } from "../../models/slotModel";
import { Request, Response } from "express";

import { AppointmentInterface } from "../../models/appointmentModel";

export interface IDoctorController {

    addDoctor(payload : DoctorInterface): Promise<void>;
    getDoctor( req : Request , res : Response) : Promise<void> ;
    updateProfile( req : Request , res : Response) : Promise<void> ;
    updatePassword( req : Request , res : Response) : Promise<void> ;
    getDoctors( req : Request , res : Response) : Promise<void> ;
    blockDoctor( req : Request , res : Response) : Promise <void> ;
    passwordReset(data : any ) : Promise<DoctorInterface | null | undefined> ;
    VerificationRequest(data : any ) : Promise<DoctorInterface | null | undefined> ;
    createSlot(payload : SlotInterface) : Promise < void> ;
    removeSlot(payload : SlotInterface) : Promise <void>;

}