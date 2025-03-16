
import { SlotInterface } from "../models/slotModel"

import { IUserService } from "./interface/IUserService"

import { IUserRepository } from "../respostories/interface/IUserRepository"

import { AppointmentInterface } from "../models/appointmentModel"
import { UserInterface } from "../models/userModel"
import { DoctorInterface } from "../models/doctorModel"


export class UserServices implements IUserService{

    private userRepository:IUserRepository
    constructor(userRepository : IUserRepository){
        this.userRepository= userRepository

    }

    // kafka - user from auth
    public async createUser(payload: UserInterface): Promise<void>{
        const response=await this.userRepository.createUser(payload);
    }
    
    public async updateProfile(email: string, profilePicture: string): Promise<void> {
          await this.userRepository.updateProfile(email, profilePicture);
    }

    public async getSlotBooking(email: string , skip: number, limit: number): Promise<SlotInterface[] | null | undefined>{
        try {
            const response=await this.userRepository.getSlotBooking(email , skip , limit)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }

    public async getSlotDetailsById(id: string ): Promise<SlotInterface | null | undefined>{
        try {
            const response=await this.userRepository.getSlotDetailsById(id )
            return response
        } catch (error) {
            console.log(error)
            
        }
    }


    public async getDoctorDetails(doctorId:string): Promise <DoctorInterface | null | undefined>{
            try {
                return await this.userRepository.getDoctorDetails(doctorId);
            } catch (error) {
                console.log(error);
            }
    }
  

    public async cancelAppointment(id: string , status : string): Promise<AppointmentInterface | null | undefined>{
        try {
            const response=await this.userRepository.cancelAppointment(id , status)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    
}