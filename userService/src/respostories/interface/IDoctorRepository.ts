
import { DoctorInterface } from "../../models/doctorModel";

import { Request, Response } from "express";


export interface IDoctorRepository{

    createDoctor( payload : DoctorInterface) : Promise <void> ;
    getDoctorData(email:string): Promise<DoctorInterface | null | undefined> ;
    updateProfile(email:string,data:object): Promise<DoctorInterface | null | undefined> ;
    updatePassword(email:string,password:string): Promise<DoctorInterface | null | undefined> ;
    VerificationRequest(emailID:string,status:string ,medicalLicenseUrl: string , degreeCertificateUrl : string ): Promise<DoctorInterface | null | undefined>

    getDoctors() : Promise<DoctorInterface[] | null | undefined>

}