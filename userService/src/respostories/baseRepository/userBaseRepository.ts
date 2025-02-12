import { Document, Model } from "mongoose";

import UserModel , { UserInterface } from "../../models/userModel"
import DoctorModel , {DoctorInterface} from "../../models/doctorModel"
import DepartmentModel, { DepartmentInterface } from "../../models/departmentModel";

import { IUserBaseRepository } from "./interface/IUserBaseRepository";

export default class UserBaseRepository implements IUserBaseRepository {

  


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
          console.log(email , "user-mail")
          const userData = await UserModel.findOne({ email : email });
          console.log(userData)
          return userData;
        } catch (error) {
          throw error;
        }
      }

      async getDoctorDetails(email: string): Promise<DoctorInterface | null> {
        try {
          console.log(email , "user-mail")
          const doctorData = await DoctorModel.findOne({ email : email });
          console.log(doctorData)
          return doctorData;
        } catch (error) {
          throw error;
        }
      }

     
      

      
      async updateProfile( email : string , data: object): Promise<UserInterface | null> {
        try {
          console.log("data..",data)
          
          const userData = await UserModel.findOneAndUpdate( 
          {email : email},
          { $set:data }, 
          { new: true });
          console.log("update-base-repo",userData)
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
    
      async findAllUsers(): Promise <UserInterface[] | null | undefined>{
        try {
            const response=await UserModel.find()
            return response
            
        } catch (error) {
            console.log(error);
            
        }
      }

      async findAllDoctors(): Promise <DoctorInterface[] | null | undefined>{
        try {
            const response=await DoctorModel.find()
            return response
            
        } catch (error) {
            console.log(error);
            
        }
      }

      async findAllDepartment(): Promise <DepartmentInterface[] | null | undefined>{
        try {
            const response=await DepartmentModel.find()
            return response
            
        } catch (error) {
            console.log(error);
            
        }
      }



}