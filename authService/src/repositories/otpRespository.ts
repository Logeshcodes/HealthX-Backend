import { OtpInterafce } from "../models/otpModel"
import OtpBaseRespository from "./baseRepositories/otpBaseRespository"
import otpModel from "../models/otpModel"

export class otpRespository{

    private baseOtpRepository:OtpBaseRespository<OtpInterafce>

    constructor(){

        this.baseOtpRepository=new OtpBaseRespository(otpModel)

    }


    public async createOtp(email:string,otp:string){
        const response = await this.baseOtpRepository.saveOtp(email,otp)
        console.log("responseOTP : " , response)
        return response
    }


    public async findOtp(email:string){
        const response=await this.baseOtpRepository.findOtp(email)
        console.log(response,"otp-repositry")
        return response
    }


    public async deleteOtp(email:string){
        const response=await this.baseOtpRepository.deleteOtp(email)
        return response
    }
}