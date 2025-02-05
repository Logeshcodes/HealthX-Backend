
import { OtpInterface } from "../../models/otpModel";
import otpModel from "../../models/otpModel"


import IOtpBaseRepository from "./interfaces/IOtpBaseRepository";

export  default class OtpBaseRespository implements IOtpBaseRepository{

   

      async createOtp(email: string, otp: string): Promise<OtpInterface | null> {
        try {
          const output = await otpModel.findOneAndUpdate(
            { email },{email,otp},
            {
              upsert: true,
              new: true,
            }
          );
          setTimeout(async () => {
            if (output?._id) {
              await otpModel.findByIdAndDelete(output._id);
            }
          }, 1200000);
          return output;
        } catch (error) {
          throw error;
        }
      }

      async findOtp(email:string){
        try {
          const response= await otpModel.findOne({email:email})
          console.log(email,response,"Found OTP")
          return response
          
        } catch (error) {
          throw error
          
        }
      }

      async deleteOtp(email:string){
        try {
          const response= await otpModel.findOneAndDelete({email:email})
          console.log(email,response,"deleted OTP")
          return response
          
        } catch (error) {
          throw error
          
        }
      }
}