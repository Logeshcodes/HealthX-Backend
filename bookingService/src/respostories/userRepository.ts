import { SlotInterface } from "../models/slotModel";

import { IUserRepository } from "./interface/IUserRepository";
import { IUserBaseRepository } from "./baseRepository/interface/IUserBaseRepository";

export class UserRepository implements IUserRepository{

    
     private userBaseRepository: IUserBaseRepository
        constructor( userBaseRepository : IUserBaseRepository){
            
            this.userBaseRepository= userBaseRepository
    
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
        
    
    
    
}