import { Document, Model } from "mongoose";
import DoctorModel , {DoctorInterface} from "../../models/doctorModel"

import { IDoctorBaseRepository } from "./interface/IDoctorBaseRepository";

import { AppointmentInterface } from "../../models/appointmentModel";
import AppointmentModel from "../../models/appointmentModel";

export class DoctorBaseRepository implements IDoctorBaseRepository {


  async createDoctor(payload: DoctorInterface): Promise<DoctorInterface | null> {
    try {
      const doctor = await DoctorModel.create(payload);
      await doctor.save();
      return doctor;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorData(email: string): Promise<DoctorInterface | null | undefined> {
    try {
      const doctorData = await DoctorModel.findOne({ email: email });
      return doctorData;
    } catch (error) {
      throw error;
    }
  }

  // Doctor - Profile - update
  async updateProfile(email:string, data: object): Promise<DoctorInterface | null | undefined> {
    try {
      const doctorData = await DoctorModel.findOneAndUpdate( 
        {email : email},
        {$set : data},
        {new: true});
      return doctorData;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(email: string, password: string): Promise<DoctorInterface | null | undefined> {
    try {
      const doctorData = await DoctorModel.findOneAndUpdate(
        { email },
        {
          $set: {
            hashedPassword: password,
          },
        },
        { new: true }
      );
      return doctorData;
    } catch (error) {
      throw error;
    }
  }


  async VerificationRequest(emailID: string, status: string ,medicalLicenseUrl: string , degreeCertificateUrl : string):  Promise<DoctorInterface | null | undefined> {
    try {

      console.log(emailID , status , "consume data...")
      const doctorData = await DoctorModel.findOneAndUpdate(
        {  email : emailID },
        {
          $set: {
            status: status ,
            medicalLicense : medicalLicenseUrl ,
            degreeCertificate : degreeCertificateUrl 
          },
        },
        { new: true }
      );
      console.log(doctorData)
      return doctorData;
    } catch (error) {
      throw error;
    }
  }

  async getDoctors(): Promise<DoctorInterface[] | null | undefined>{
    try {
        const response=await DoctorModel.find()
        return response
        
    } catch (error) {
        console.log(error);
        
    }
  }


  public async  getAllAppointmentDetails(email: string, skip: number, limit: number  , filter : string): Promise<AppointmentInterface[] | null | undefined> {
    try {
        const response = await AppointmentModel.find({doctorEmail : email })
            .skip(skip)  
            .limit(limit)  
            .exec();
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
}