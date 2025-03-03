import { IUserBaseRepository } from "./interface/IUserBaseRepository";
import SlotModel , {SlotInterface} from "../../models/slotModel";

import AppointmentModel from "../../models/appointmentModel";
import { AppointmentInterface } from "../../models/appointmentModel";
import UserModel , { UserInterface } from "../../models/userModel";


export default class UserBaseRepository implements IUserBaseRepository {


    async createUser(payload: UserInterface): Promise<any> {
        try {
          
          
          const user = await UserModel.create(payload);
          console.log('User created or updated:', user);
          
          return user;
        } catch (error) {
          console.error('Error creating user:', error);
          throw error;
        }
      }


      async updateProfile( email: string, profilePicture: string): Promise<UserInterface | null> {
        try {
          console.log("data..!",profilePicture)
          
          const userData = await UserModel.findOneAndUpdate( 
          {email : email},
          { $set: { profilePicture : profilePicture} }, 
          { new: true });
          console.log("update-auth-base-repo",userData)
          return userData;
        } catch (error) {
          throw error;
        }
      }


    public async getSlotBooking(email: string, skip: number, limit: number): Promise<SlotInterface[] | null | undefined> {
        try {
            const response = await SlotModel.find({ email })
                .skip(skip)  
                .limit(limit)  
                .exec();
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async  getSlotDetailsById( id : string ) : Promise <SlotInterface | null | undefined> {
        try {
            const response = await SlotModel.findById({_id : id})
                
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async  getAppointment(id: string): Promise<AppointmentInterface[] | null | undefined> {
        try {
            const response = await AppointmentModel.find({patientId : id })
                
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    


}