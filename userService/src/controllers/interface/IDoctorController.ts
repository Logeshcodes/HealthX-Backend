import { DoctorInterface } from "../../models/doctorModel";

import { Request, Response } from "express";

export interface IDoctorController {

    addDoctor(payload : DoctorInterface): Promise<void>;
    getDoctor( req : Request , res : Response) : Promise<void> ;
    updateProfile( req : Request , res : Response) : Promise<void> ;
    updatePassword( req : Request , res : Response) : Promise<void> ;
    getDoctors( req : Request , res : Response) : Promise<void> ;
    blockDoctor( req : Request , res : Response) : Promise <void> ;
    passwordReset(data : any ) : Promise<DoctorInterface | null | undefined> ;
    VerificationRequest(data : any ) : Promise<DoctorInterface | null | undefined> ;

}