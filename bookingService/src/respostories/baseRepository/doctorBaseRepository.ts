import { Document, Model } from "mongoose";
import SlotModel , {SlotInterface} from "../../models/slotModel";
import DoctorModel , {DoctorInterface} from "../../models/doctorModel";

import AppointmentModel, { AppointmentInterface } from "../../models/appointmentModel";

import { IDoctorBaseRepository } from "./interface/IDoctorBaseRepository";
import { response } from "express";

export class DoctorBaseRepository implements IDoctorBaseRepository {


  async createDoctor(payload: DoctorInterface): Promise<DoctorInterface | null> {
    try {
      console.log("Kafka payload___________***" , payload)
      const doctor = await DoctorModel.create(payload);
      await doctor.save();
      return doctor;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile( email: string, profilePicture: string , location : string): Promise<  void> {
    try {
      console.log("data..!",profilePicture)
      
      const userData = await DoctorModel.findOneAndUpdate( 
      {email : email},
      { $set: { profilePicture : profilePicture , location : location} }, 
      { new: true });
      console.log("update-auth-base-repo",userData)
    
    } catch (error) {
      throw error;
    }
  }



  async createSlot(data: object): Promise<SlotInterface | null> {
    try {
      console.log("data base..dta..", data);
      const slot = await SlotModel.create(data);  
      console.log("base respo", slot);
      return slot;
    } catch (error) {
      console.error("Error creating slot:", error);
      return null;
    }
}


  async deleteSlot(_id: string): Promise<any> {
    try {
      console.log("data base id..", _id);
      const slot = await SlotModel.findOneAndDelete({ _id: _id });
      console.log("base respo id", slot);
      return slot;
    } catch (error) {
      console.error("Error creating slot:", error);
      return null;
    }
}



async getSlotBooking(email: string): Promise<SlotInterface[] | null | undefined> {
  try {
    const doctorData = await SlotModel.find({ email: email });
    return doctorData;
  } catch (error) {
    throw error;
  }
}


public async  getAllAppointmentDetails(id: string, skip: number, limit: number  , activeTab : string): Promise<AppointmentInterface[] | null | undefined> {

  try {

    let query: any = { doctorId: id };
  
    const today = new Date();
    switch (activeTab) {
        case 'upcoming':
            query.appointmentDate = { $gte: today };
            query.status = { $ne: 'cancelled' };
            break;
        case 'past':
            query.appointmentDate = { $lt: today };
            query.status = { $ne: 'cancelled' };
            break;
        case 'cancelled':
            query.status = 'cancelled';
            break;
        default:
            
            break;
    }

      const response = await AppointmentModel.find(query)
          .sort({appointmentDate : -1})
          .skip(skip)  
          .limit(limit)  
          .exec();
      return response;
  } catch (error) {
      console.log(error);
      throw error;
  }
}


public async  getAppointment(id: string): Promise<AppointmentInterface[] | null | undefined> {
try {
    const response = await AppointmentModel.find({doctorId : id })
        
    return response;
} catch (error) {
    console.log(error);
    throw error;
}
}




 
}