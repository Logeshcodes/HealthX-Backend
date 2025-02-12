
import { DoctorRepository } from "../respostories/doctorRepository"
import { DoctorInterface } from "../models/doctorModel"

import { IDoctorService } from "./interface/IDoctorService"
import { IDoctorRepository } from "../respostories/interface/IDoctorRepository"

export class DoctorServices implements IDoctorService{

    private doctorRepository:IDoctorRepository
    constructor(doctorRepository : IDoctorRepository){
        this.doctorRepository= doctorRepository

    }
    public async createDoctor(payload:DoctorInterface){
        try {
            const response=await this.doctorRepository.createDoctor(payload)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }

    
    public async getDoctorData(email:string) : Promise<DoctorInterface | null | undefined>{
        try {
            const response=await this.doctorRepository.getDoctorData(email)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updateProfile(email:string,data:object): Promise<DoctorInterface | null | undefined>{
        try {
            const response=await this.doctorRepository.updateProfile( email ,data)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updatePassword(email:string,password:string): Promise<DoctorInterface | null | undefined>{
        try {
            const response=await this.doctorRepository.updatePassword(email,password)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    public async VerificationRequest(emailID:string,status:string ,medicalLicenseUrl : string , degreeCertificateUrl : string): Promise<DoctorInterface | null | undefined>{
        try {
            const response=await this.doctorRepository.VerificationRequest(emailID,status ,medicalLicenseUrl , degreeCertificateUrl)
            return response
        } catch (error) {
            console.log(error)
        }
    }
    public async getDoctors(): Promise<DoctorInterface[] | null | undefined>{
        try {
            const response=await this.doctorRepository.getDoctors()
            return response
        } catch (error) {
            console.log(error)
        }
    }
    
}