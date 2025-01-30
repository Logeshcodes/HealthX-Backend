import { Document, Model } from "mongoose";

import UserModel , { UserInterface } from "../../models/userModel"
import DoctorModel , {DoctorInterface} from "../../models/doctorModel"

export default class UserBaseRepository <T extends Document>{

    private model : Model <T> 

    constructor(model:Model<T>){
        this.model=model

    }


    async createUser(payload: UserInterface): Promise<UserInterface | null> {
        try {
          const user = await UserModel.create(payload);
          await user.save();
          return user;
        } catch (error) {
          throw error;
        }
      }
    
      async getUserData(email: string): Promise<UserInterface | null> {
        try {
          const userData = await UserModel.findOne({ email: email });
          return userData;
        } catch (error) {
          throw error;
        }
      }
      async updateProfile(id: any, data: object): Promise<UserInterface | null> {
        try {
          const userData = await UserModel.findByIdAndUpdate(id, data, {
            new: true,
          });
          return userData;
        } catch (error) {
          throw error;
        }
      }
    
      async updatePassword(email: string, password: string): Promise<UserInterface | null> {
        try {
          const userData = await UserModel.findOneAndUpdate(
            { email },
            {
              $set: {
                hashedPassword: password,
              },
            },
            { new: true }
          );
          return userData;
        } catch (error) {
          throw error;
        }
      }
    
      async findAllUsers(){
        try {
            const response=await UserModel.find()
            return response
            
        } catch (error) {
            console.log(error);
            
        }
      }

      async findAllDoctors(){
        try {
            const response=await DoctorModel.find()
            return response
            
        } catch (error) {
            console.log(error);
            
        }
      }



}