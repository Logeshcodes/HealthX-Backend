import DoctorModel , {DoctorInterface} from "../models/doctorModel"
import BannerModel, { BannerInterface } from "../models/bannerModel";
import { IDoctorRepository } from "./interface/IDoctorRepository";
import { GenericRespository } from "./GenericRepository.ts/GenericRepository"

export class DoctorRepository extends GenericRespository<DoctorInterface> implements IDoctorRepository{

    constructor(){
        super(DoctorModel)
    }

    async createDoctor(payload: DoctorInterface): Promise <void>{
        await this.create(payload);
    }

    async updateWallet(doctorId : string , wallet : any ): Promise <void>{
        await this.findIdAndUpdate( doctorId ,  wallet); 
    }

    async getDoctorData(email:string): Promise<DoctorInterface | null | undefined>{
        try {
            return await this.findOne({email});
        } catch (error) {
            throw error ;
        }
    }
    async updateProfile(email:string,data:object): Promise<DoctorInterface | null | undefined>{
        try {
            return await this.update( email,data);    
        } catch (error) {
            console.log(error)  
        }
    }
    
    async updatePassword(email:string,hashedPassword:string): Promise<DoctorInterface | null | undefined>{
        try {
            return await this.update(email,{hashedPassword : hashedPassword});
        } catch (error) {
            console.log(error); 
        }
    }

    async findAllBanners(): Promise <BannerInterface[] | null | undefined>{
        try {
            const currentDate = new Date();
            return await BannerModel.find({
                isListed: true,
                role: "Doctor",
                startDate: { $lte: currentDate }, 
                endDate: { $gte: currentDate }    
              });
        } catch (error) {
            console.log(error);
        }
    }


    async VerificationRequest(emailID:string,status:string ,medicalLicense: string , degreeCertificate : string ): Promise<DoctorInterface | null | undefined>{
        try {
            let data = {status , medicalLicense , degreeCertificate}
            return await this.update(emailID ,data );
        } catch (error) {
            console.log(error);
        }
    }

    async getDoctors(): Promise<DoctorInterface[] | null | undefined>{
        try {
            return await this.find();
        } catch (error) {
            console.log(error);
        }
    }




  
    
    
}