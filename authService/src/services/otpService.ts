import IOtpRepository from "@/repositories/interfaces/IOtpRepository"
import IOtpServices from "./interfaces/IOtpService"

export default class OtpService implements IOtpServices{
    private otpRespository:IOtpRepository
    constructor(otpRespository:IOtpRepository){
        this.otpRespository=otpRespository
    }
    
    public async createOtp(email:string,otp:string){
        return await this.otpRespository.createOtp(email,otp)
    }

    public async findOtp(email:string){
        return await this.otpRespository.findOtp(email)
    }

    public async deleteOtp(email:string): Promise<void>{
        await this.otpRespository.deleteOtp(email)   
    }
}