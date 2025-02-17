
import { SlotInterface } from "../models/slotModel"

import { IDoctorService } from "./interface/IDoctorService"

import { IDoctorRepository } from "../respostories/interface/IDoctorRepository"


export class DoctorServices implements IDoctorService{

    private doctorRepository:IDoctorRepository
    constructor(doctorRepository : IDoctorRepository){
        this.doctorRepository= doctorRepository

    }


    public async createSlot( data : object): Promise<SlotInterface | null | undefined>{
        try {
            const response=await this.doctorRepository.createSlot( data)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }


    public async getSlotBooking(email: string): Promise<SlotInterface[] | null | undefined>{
        try {
            const response=await this.doctorRepository.getSlotBooking(email)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }

    public async deleteSlot(_id: string): Promise<SlotInterface | null | undefined>{
        try {
            const response=await this.doctorRepository.deleteSlot(_id)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    
}