import { SlotInterface } from "../models/slotModel";
import { AppointmentInterface } from "../models/appointmentModel";
import { UserInterface } from "../models/userModel";

import { IUserRepository } from "./interface/IUserRepository";
import { IUserBaseRepository } from "./baseRepository/interface/IUserBaseRepository";

export class UserRepository implements IUserRepository{

    
     private userBaseRepository: IUserBaseRepository
        constructor( userBaseRepository : IUserBaseRepository){
            
            this.userBaseRepository= userBaseRepository
    
        }

        // kafka user from auth
        async createUser(payload:UserInterface): Promise<void>{
            try {
    
                console.log('in the repository ', payload)
                const response=await this.userBaseRepository.createUser(payload)
                return response
                
            } catch (error) {
                
            }
        }

        // kafka update from user
        public async updateProfile(email: string, profilePicture: string): Promise<any> {
            try {
                const response = await this.userBaseRepository.updateProfile(email,profilePicture);
                return response;
            } catch (error) {
                throw error;
            }
        }


        async getSlotBooking(email: string, skip: number, limit: number): Promise<SlotInterface[] | null | undefined> {
            try {
                const response=await this.userBaseRepository.getSlotBooking(email, skip , limit)
                return response;
            } catch (error) {
                console.log(error);
            }
        }
        async getSlotDetailsById( id : string ) : Promise <SlotInterface | null | undefined> {
            try {
                const response=await this.userBaseRepository.getSlotDetailsById(id)
                return response;
            } catch (error) {
                console.log(error);
            }
        }
        
        
        async getAppointment(id: string): Promise<AppointmentInterface[] | null | undefined> {
            try {
                const response=await this.userBaseRepository.getAppointment(id)
                return response;
            } catch (error) {
                console.log(error);
            }
        }
    
    
}