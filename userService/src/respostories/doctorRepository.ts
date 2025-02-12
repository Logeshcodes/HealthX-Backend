import DoctorModel , {DoctorInterface} from "../models/doctorModel"
import { DoctorBaseRepository } from "./baseRepository/doctorBaseRepository";

import { IDoctorRepository } from "./interface/IDoctorRepository";
import { IDoctorBaseRepository } from "./baseRepository/interface/IDoctorBaseRepository";

export class DoctorRepository implements IDoctorRepository{

    private doctorBaseRepository: IDoctorBaseRepository
    constructor( doctorBaseRepository : IDoctorBaseRepository){
        
        this.doctorBaseRepository= doctorBaseRepository

    }
    async createDoctor(payload: DoctorInterface){
        try {
            const response=await this.doctorBaseRepository.createDoctor(payload)
            
            
        } catch (error) {
            
        }
    }
    async getDoctorData(email:string): Promise<DoctorInterface | null | undefined>{
        try {
            const response=await this.doctorBaseRepository.getDoctorData(email)
            return response
            
        } catch (error) {
            
        }
    }
    async updateProfile(email:string,data:object): Promise<DoctorInterface | null | undefined>{
        try {
            const response=await this.doctorBaseRepository.updateProfile( email,data)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    async updatePassword(email:string,password:string): Promise<DoctorInterface | null | undefined>{
        try {
            const response=await this.doctorBaseRepository.updatePassword(email,password)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }


    async VerificationRequest(emailID:string,status:string ,medicalLicenseUrl: string , degreeCertificateUrl : string ): Promise<DoctorInterface | null | undefined>{
        try {
            const response=await this.doctorBaseRepository.VerificationRequest(emailID,status ,medicalLicenseUrl , degreeCertificateUrl)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    async getDoctors(): Promise<DoctorInterface[] | null | undefined>{
        try {
            const response=await this.doctorBaseRepository.getDoctors()
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    
    
}