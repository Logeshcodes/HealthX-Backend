
import { SlotInterface } from "../models/slotModel"
import { DoctorInterface } from "../models/doctorModel"
import { AppointmentInterface } from "../models/appointmentModel"

import { IDoctorService } from "./interface/IDoctorService"

import { IDoctorRepository } from "../respostories/interface/IDoctorRepository"


export class DoctorServices implements IDoctorService{

    private doctorRepository:IDoctorRepository
    constructor(doctorRepository : IDoctorRepository){
        this.doctorRepository= doctorRepository

    }

    public async createDoctor(payload:DoctorInterface){
        try {
            const response=await this.doctorRepository.createDoctor(payload)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }

    public async updateProfile(email: string, profilePicture: string , location : string ): Promise<void> {
        try {
          const response = await this.doctorRepository.updateProfile(email, profilePicture , location);
        
        } catch (error) {
          throw error;
        }
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


    
    public async getAllAppointmentDetails(id: string , skip: number, limit: number , activeTab : string): Promise<AppointmentInterface[] | null | undefined>{
        try {
            const response=await this.doctorRepository.getAllAppointmentDetails(id , skip , limit , activeTab)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }

    public async getAppointment(id: string): Promise<AppointmentInterface[] | null | undefined>{
        try {
            const response=await this.doctorRepository.getAppointment(id )
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    
}