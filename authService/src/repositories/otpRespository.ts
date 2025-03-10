import { GenericRespository } from "./GenericRepository.ts/GenericRepository"
import IOtpRepository from "./interfaces/IOtpRepository"
import OtpModel, { OtpInterface } from "../models/otpModel"

export class OtpRespository extends GenericRespository<OtpInterface> implements IOtpRepository {

    constructor(){
        super(OtpModel)
    }
    
    public async createOtp(email:string,otp:string){
        const response = await this.update(email,{otp : otp})
        console.log("responseOTP : " , response)
        setTimeout(async () => {
            if (response?._id) {
            await OtpModel.findByIdAndDelete(response._id);
            }
        }, 1200000);
        return response
    }


    public async findOtp(email:string){
        const response=await this.findOne(email)
        console.log(response,"otp-repositry")
        return response
    }


    public async deleteOtp(email:string): Promise<void>{
        console.log("email id , repo", email)
        await this.delete({email : email});

    }
}