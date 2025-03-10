import { DoctorInterface } from "../../models/doctorModel";
import { SlotInterface } from "../../models/slotModel";
import { Request, Response } from "express";


export interface IDoctorController {

    addDoctor(payload : DoctorInterface): Promise<void>;
    getDoctor( req : Request , res : Response) : Promise<void> ;
    updateProfile( req : Request , res : Response) : Promise<void> ;
    updatePassword( req : Request , res : Response) : Promise<void> ;
    getDoctors( req : Request , res : Response) : Promise<void> ;
    findAllBanners( req : Request , res : Response) : Promise <void> ;
    blockDoctor( req : Request , res : Response) : Promise <void> ;
    passwordReset(data : any ) : Promise<DoctorInterface | null | undefined> ;
    VerificationRequest(data : any ) : Promise<DoctorInterface | null | undefined> ;
    createSlot(payload : SlotInterface) : Promise < void> ;
    removeSlot(payload : SlotInterface) : Promise <void>;

    updateWallet( data:{doctorId : string ,appointmentId : string ,transactionId : string ,  amount : number , type : string}): Promise<DoctorInterface | undefined | null>;
}