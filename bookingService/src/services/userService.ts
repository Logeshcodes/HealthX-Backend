
import { SlotInterface } from "../models/slotModel"

import { IUserService } from "./interface/IUserService"

import { IUserRepository } from "../respostories/interface/IUserRepository"

import { AppointmentInterface } from "../models/appointmentModel"
import { UserInterface } from "../models/userModel"


export class UserServices implements IUserService{

    private userRepository:IUserRepository
    constructor(userRepository : IUserRepository){
        this.userRepository= userRepository

    }

    // kafka - user from auth
    public async createUser(payload: UserInterface){
        try {
            const response=await this.userRepository.createUser(payload)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }

    // kafka update from user
    
    public async updateProfile(email: string, profilePicture: string): Promise<UserInterface | null> {
        try {
          const response = await this.userRepository.updateProfile(email, profilePicture);
          return response || null;
        } catch (error) {
          throw error;
        }
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


    public async getAppointment(id: string): Promise<AppointmentInterface[] | null | undefined>{
        try {
            const response=await this.userRepository.getAppointment(id )
            return response
        } catch (error) {
            console.log(error)
            
        }
    }

    public async cancelAppointment(id: string): Promise<AppointmentInterface | null | undefined>{
        try {
            const response=await this.userRepository.cancelAppointment(id )
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    
}