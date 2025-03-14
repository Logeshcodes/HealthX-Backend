import SlotModel, { SlotInterface } from "../models/slotModel";
import DoctorModel, { DoctorInterface } from "../models/doctorModel";
import AppointmentModel, { AppointmentInterface } from "../models/appointmentModel";
import { IDoctorRepository } from "./interface/IDoctorRepository";
import { GenericRespository } from "./GenericRepository.ts/GenericRepository"

export class DoctorRepository  extends GenericRespository<DoctorInterface> implements IDoctorRepository{

    constructor(){
        super(DoctorModel);
    }

    async createDoctor(payload: DoctorInterface){
        await this.create(payload);
    }

    public async updateProfile(email: string, profilePicture: string , location : string): Promise<void> {
        await this.update(email , { profilePicture : profilePicture , location : location});
    }

    async createSlot(data : object) : Promise<SlotInterface | null | undefined>{
        try {
            return await SlotModel.create(data);  
        } catch (error) {
            throw error;
        }
    }

    async deleteSlot( _id: string) : Promise<SlotInterface | null | undefined>{
        try {
            return await SlotModel.findByIdAndDelete(_id)
        } catch (error) {
            throw error;
        }
    }
   

    async getSlotBooking(email: string): Promise<SlotInterface[] | null | undefined>{
        try {
            return await SlotModel.find({ email: email });        
        } catch (error) {
            throw error;
        }
    }

    async getAllAppointmentDetails(id: string, skip: number, limit: number  , activeTab : string): Promise<AppointmentInterface[] | null | undefined> {
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
           
            return await AppointmentModel.find(query).sort({appointmentDate : -1}).skip(skip).limit(limit).exec();
        } catch (error) {
            throw error;
        }
    }



   
    
}