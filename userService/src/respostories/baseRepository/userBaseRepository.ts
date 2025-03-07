import UserModel , { ITransaction, UserInterface } from "../../models/userModel"
import DoctorModel , {DoctorInterface} from "../../models/doctorModel"
import DepartmentModel, { DepartmentInterface } from "../../models/departmentModel";

import BannerModel, { BannerInterface } from "../../models/bannerModel";

import { IUserBaseRepository } from "./interface/IUserBaseRepository";

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

      async updateWallet(userId: string, wallet: { balance: number; transactions: ITransaction[] }): Promise<UserInterface | null> {
        try {
            console.log("Final wallet data:", wallet);
    
            // Use correct $set format for nested fields
            const userData = await UserModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        "wallet.balance": wallet.balance,
                        "wallet.transactions": wallet.transactions,
                    },
                },
                { new: true }
            );
    
            return userData;
        } catch (error) {
            console.error("Error updating user wallet:", error);
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

      async findAllBanners(): Promise <BannerInterface[] | null | undefined>{
        try {

          const currentDate = new Date();

          const response = await BannerModel.find({
            isListed: true,
            role: "Patient",
            startDate: { $lte: currentDate }, 
            endDate: { $gte: currentDate }    
          });
          
            return response
            
        } catch (error) {
            console.log(error);
            
        }
      }
      async findAllDoctors(): Promise <DoctorInterface[] | null | undefined>{
        try {
            const response=await DoctorModel.find({isBlocked: false , status : "approved"})
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