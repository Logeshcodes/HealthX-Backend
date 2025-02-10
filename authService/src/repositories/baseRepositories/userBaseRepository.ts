import { Document , Model } from "mongoose"

import bcrypt from "bcrypt";

import UserModel , { UserInterface } from "../../models/userModel"

import IUserBaseRepository from "./interfaces/IUserBaseRepository";

export default class UserBaseRepository  implements IUserBaseRepository{

    

    async findByEmail(email:string) : Promise< UserInterface|null >{

        console.log("User")
        return await UserModel.findOne({email:email})
    }

    async createUser(userData:any):Promise< UserInterface |null>{
        try {
            console.log("userData??... : " ,userData)
            const user=await UserModel.create(userData)
            console.log("userData?? : " ,user)
            await user.save()
            return user
        } catch (error) {
            throw error
            
        }


    }

    async resetPassword(email:string,password:string):Promise<UserInterface|null >{
        try {

            console.log("user new pass" ,password , email )
            const updatedUser = await UserModel.findOneAndUpdate(
                { email: email }, 
                { hashedPassword: password },
                { new: true } 
              );
              console.log("new upd pwd " , updatedUser)
        
              return updatedUser;
        } catch (error) {
            throw error
            
        }
    }


    async googleLogin(  name: string,email: string,password: string , profilePicture : string ): Promise<UserInterface | null> {
        try {
            const user = await this.findByEmail(email);
    
            if (!user) {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
    
                // Create a new user
                const newUser = await this.createUser({
                    
                    username :name,
                    email,
                    hashedPassword: password,
                    profilePicture : profilePicture,
                    authenticationMethod : "Google"
                });
    
                if (!newUser) {
                    // Handle unexpected null from createDoctor
                    throw (new Error("Failed to create a new Doctor"));
                }
    
                if (newUser.isBlocked) {
                    throw (new Error("Admin blocked the user"));
                }
    
                return newUser;
            }
    
            // If user exists, check if they are blocked
            if (user.isBlocked) {
                throw new Error("Admin blocked the user");
            }
    
            // Return the existing user if not blocked
            return user;
        } catch (error) {
            throw (error);
        }
    }


    async updateProfile( email : string , data: object): Promise<UserInterface | null> {
        try {
          console.log("data..",data)
          
          const userData = await UserModel.findOneAndUpdate( 
          {email : email},
          { $set: {...data} }, 
          { new: true });
          console.log("update-auth-base-repo",userData)
          return userData;
        } catch (error) {
          throw error;
        }
      }
    
}