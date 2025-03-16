import SlotModel, { SlotInterface } from "../models/slotModel";
import UserModel, { UserInterface } from "../models/userModel";
import { IUserRepository } from "./interface/IUserRepository";
import { GenericRespository } from "./GenericRepository.ts/GenericRepository"
import DoctorModel, { DoctorInterface } from "../models/doctorModel";

export class UserRepository extends GenericRespository<UserInterface> implements IUserRepository{

    constructor(){
        super(UserModel);
    }

        // kafka 
        async createUser(payload:UserInterface): Promise<void>{
            await this.create(payload); 
        }

        public async updateProfile(email: string, profilePicture: string): Promise<void> {
            await this.update(email,{profilePicture : profilePicture});
        }

        public async cancelAppointment(id: string , status : string): Promise<any> {
            try {
                return await this.findIdAndUpdate(id , {status : status});
            } catch (error) {
                throw error;
            }
        }

        async getDoctorDetails(doctorId:string) : Promise<DoctorInterface | null | undefined>{
            try {
                return await DoctorModel.findById({_id : doctorId});
            } catch (error) {
                throw error ;
            }
        }

        async getSlotBooking(email: string, skip: number, limit: number): Promise<SlotInterface[] | null | undefined> {
            try {
                return await SlotModel.find({ email }).skip(skip).limit(limit).exec();
            } catch (error) {
                throw error;
            }
        }
        async getSlotDetailsById( id : string ) : Promise <SlotInterface | null | undefined> {
            try {
                return await SlotModel.findById({_id : id})
            } catch (error) {
                throw error;
            }
        }
        
        

    
    
}