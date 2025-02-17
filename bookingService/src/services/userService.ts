
import { SlotInterface } from "../models/slotModel"

import { IUserService } from "./interface/IUserService"

import { IUserRepository } from "../respostories/interface/IUserRepository"


export class UserServices implements IUserService{

    private userRepository:IUserRepository
    constructor(userRepository : IUserRepository){
        this.userRepository= userRepository

    }


   
    public async getSlotBooking(email: string , skip: number, limit: number): Promise<SlotInterface[] | null | undefined>{
        try {
            const response=await this.userRepository.getSlotBooking(email , skip , limit)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    
}