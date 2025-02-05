import { OtpInterface } from "../models/otpModel"
import OtpBaseRespository from "./baseRepositories/otpBaseRepository"
import otpModel from "../models/otpModel"

import IOtpBaseRepository from "./baseRepositories/interfaces/IOtpBaseRepository"

export class OtpRespository implements IOtpBaseRepository {


    private baseOtpRepository:IOtpBaseRepository
    constructor(baseOtpRepository:IOtpBaseRepository){
        this.baseOtpRepository=baseOtpRepository

    }
    

    public async createOtp(email:string,otp:string){
        const response = await this.baseOtpRepository.createOtp(email,otp)
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