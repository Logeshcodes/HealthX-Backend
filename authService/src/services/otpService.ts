import IOtpRepository from "@/repositories/interfaces/IOtpRepository"
import IOtpServices from "./interfaces/IOtpService"

export default class OtpService implements IOtpServices{
    private otpRespository:IOtpRepository
    constructor(otpRespository:IOtpRepository){
        this.otpRespository=otpRespository

    }
    public async createOtp(email:string,otp:string){
        const response= await this.otpRespository.createOtp(email,otp)
        console.log('SecondResponseOtp : ' , response)
        return response
    }

    public async findOtp(email:string){
        const response=await this.otpRespository.findOtp(email)
        return response
    }

    public async deleteOtp(email:string){
        const response=await this.otpRespository.deleteOtp(email)
        return response
    }
}