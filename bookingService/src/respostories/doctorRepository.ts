import { SlotInterface } from "../models/slotModel";
import { DoctorInterface } from "../models/doctorModel";
import { AppointmentInterface } from "../models/appointmentModel";
import { IDoctorRepository } from "./interface/IDoctorRepository";

import { IDoctorBaseRepository } from "./baseRepository/interface/IDoctorBaseRepository";


export class DoctorRepository implements IDoctorRepository{

    private doctorBaseRepository: IDoctorBaseRepository
    constructor( doctorBaseRepository : IDoctorBaseRepository){
        
        this.doctorBaseRepository= doctorBaseRepository

    }

    async createDoctor(payload: DoctorInterface){
        try {
            const response=await this.doctorBaseRepository.createDoctor(payload)
            
            
        } catch (error) {
            
        }
    }

    public async updateProfile(email: string, profilePicture: string): Promise<void> {
        try {
            const response = await this.doctorBaseRepository.updateProfile(email,profilePicture);
            return response;
        } catch (error) {
            throw error;
        }
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

    async getAllAppointmentDetails(id: string, skip: number, limit: number  , activeTab : string): Promise<AppointmentInterface[] | null | undefined> {
        try {
            const response=await this.doctorBaseRepository.getAllAppointmentDetails(id, skip , limit , activeTab)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAppointment(id: string): Promise<AppointmentInterface[] | null | undefined> {
        try {
            const response=await this.doctorBaseRepository.getAppointment(id)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

   
    
}