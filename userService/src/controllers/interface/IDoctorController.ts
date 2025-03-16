import { WalletData } from "../../types/walletType";
import { DoctorInterface } from "../../models/doctorModel";
import { SlotInterface } from "../../models/slotModel";
import { Request, Response } from "express";

export interface IDoctorController {

    addDoctor(payload : DoctorInterface): Promise<void>;
    passwordReset(data : any ) : Promise<void> ;
    updateWalletCancelAppointmnet( data: WalletData): Promise<void>;
    updateWalletBookAppointment( data: WalletData): Promise<void>;

    getDoctor( req : Request , res : Response) : Promise<void> ;
    updateProfile( req : Request , res : Response) : Promise<void> ;
    getDoctors( req : Request , res : Response) : Promise<void> ;
    findAllBanners( req : Request , res : Response) : Promise <void> ;
    blockDoctor( req : Request , res : Response) : Promise <void> ;
    updatePassword( req : Request , res : Response) : Promise<void> ;
    VerificationRequest(data : any ) : Promise<DoctorInterface | null | undefined> ;
    createSlot(payload : SlotInterface) : Promise < void> ;
    removeSlot(payload : SlotInterface) : Promise <void>;

    
}