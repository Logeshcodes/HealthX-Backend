import { SlotInterface } from "../models/slotModel";

import { IDoctorRepository } from "./interface/IDoctorRepository";

import { IDoctorBaseRepository } from "./baseRepository/interface/IDoctorBaseRepository";


export class DoctorRepository implements IDoctorRepository{

    private doctorBaseRepository: IDoctorBaseRepository
    constructor( doctorBaseRepository : IDoctorBaseRepository){
        
        this.doctorBaseRepository= doctorBaseRepository

    }

   
    async createSlot(data : object) : Promise<SlotInterface | null | undefined>{
        try {
            const response=await this.doctorBaseRepository.createSlot( data)
            return response ;
            
        } catch (error) {
            
        }
    }

    async deleteSlot( _id: string) : Promise<SlotInterface | null | undefined>{
        try {
            const response=await this.doctorBaseRepository.deleteSlot( _id)
            return response ;
            
        } catch (error) {
            
        }
    }


    async getSlotBooking(email: string): Promise<SlotInterface[] | null | undefined>{
        try {
            const response=await this.doctorBaseRepository.getSlotBooking(email)
            return response
            
        } catch (error) {
            
        }
    }
   
    
}