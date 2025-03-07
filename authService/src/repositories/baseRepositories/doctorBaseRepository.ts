
import DoctorModel , {DoctorInterface} from "../../models/doctorModel"


import bcrypt from "bcrypt";

import IDoctorBaseRepository from "./interfaces/IDoctorBaseRepository";

export default class DoctorBaseRepository implements IDoctorBaseRepository{


    async findByEmail(email:string):Promise<DoctorInterface|null >{
        return await DoctorModel.findOne({email:email})
    }

  
   
    async createDoctor(userData:any):Promise<DoctorInterface |null>{
        try {
            console.log("userdata?? : " , userData)
            const user=await DoctorModel.create(userData)
            console.log("Details?? : " , user)
            await user.save()
            return user
        } catch (error) {
            throw error
            
        }


    }


    // update - password - doctor - consume from userService

    async resetPassword(email:string,password:string):Promise<DoctorInterface|null >{
        try {
            const updatedUser = await DoctorModel.findOneAndUpdate(
                { email: email }, 
                { hashedPassword: password },
                { new: true } 
              );
        
              return updatedUser;
        } catch (error) {
            throw error
            
        }
    }


    async googleLogin( name: string, email: string,password: string): Promise<DoctorInterface | null>{

        try {
            const user = await this.findByEmail(email);
    
            if (!user) {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
    
                // Create a new user
                const newUser = await this.createDoctor({
                    name,
                    email,
                    password: hashedPassword,
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



    async updateProfile( email: string, profilePicture: string): Promise<  void> {
        try {
          console.log("data..!",profilePicture)
          
          const userData = await DoctorModel.findOneAndUpdate( 
          {email : email},
          { $set: { profilePicture : profilePicture} }, 
          { new: true });
          console.log("update-auth-base-repo",userData)
        
        } catch (error) {
          throw error;
        }
      }
    async blockDoctor(email : string, isBlocked : boolean  , status : string  ) : Promise<void> {
        try {
          console.log("data..!",email, isBlocked  , status)
          
          const userData = await DoctorModel.findOneAndUpdate( 
          {email : email},
          { $set: { isBlocked : isBlocked , status : status} }, 
          { new: true });
          console.log("update-auth-base-repo",userData)
        
        } catch (error) {
          throw error;
        }
      }
}