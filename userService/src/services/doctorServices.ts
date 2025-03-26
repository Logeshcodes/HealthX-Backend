import { DoctorInterface } from "../models/doctorModel"
import { IDoctorService } from "./interface/IDoctorService"
import { IDoctorRepository } from "../respostories/interface/IDoctorRepository"
import { BannerInterface } from "../models/bannerModel"

export class DoctorServices implements IDoctorService{

    private doctorRepository:IDoctorRepository
    constructor(doctorRepository : IDoctorRepository){
        this.doctorRepository= doctorRepository
    }
    
    public async createDoctor(payload:DoctorInterface): Promise <void>{
        await this.doctorRepository.createDoctor(payload);
    }

    public async updateWallet(doctorId : string , wallet : any): Promise <void>{
        await this.doctorRepository.updateWallet( doctorId , wallet);  
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
    public async updatePassword(email:string,hashedPassword:string): Promise<DoctorInterface | null | undefined>{
        try {
            const response=await this.doctorRepository.updatePassword(email,hashedPassword)
            return response
        } catch (error) {
            console.log(error)
        }
    }

  public async findAllBanners() : Promise <BannerInterface[] | null | undefined>{
        try {
            const response=await this.doctorRepository.findAllBanners()
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