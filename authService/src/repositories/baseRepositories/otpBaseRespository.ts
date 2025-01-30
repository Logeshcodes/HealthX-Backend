import { otpGenerateInterface } from "../../Interface/otpGenerateInterface"

import otpModel from "../../models/otpModel"

import { Document, Model } from "mongoose";

export  default class OtpBaseRespository <T extends Document>{

    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
      }


      async saveOtp(email: string, otp: string): Promise<T> {
        try {
          const output = await this.model.findOneAndUpdate(
            { email },
            { email, otp },
            { upsert: true, new: true }
          );
          console.log("SaveOtp.....")
          setTimeout(async () => {
            if (output?._id) {
              await this.model.findByIdAndDelete(output._id);
            }
          }, 1200000);
          console.log("SaveOtp.....output : ", output)
          return output; // No error now
         
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