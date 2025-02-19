import { Document, Model } from "mongoose";
import SlotModel , {SlotInterface} from "../../models/slotModel";

import { IDoctorBaseRepository } from "./interface/IDoctorBaseRepository";
import { response } from "express";

export class DoctorBaseRepository implements IDoctorBaseRepository {


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



 
}