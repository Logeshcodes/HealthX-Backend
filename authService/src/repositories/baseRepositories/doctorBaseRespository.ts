
import DoctorModel , {DoctorInterface} from "../../models/doctorModel"
import { Document , Model } from "mongoose"
import bcrypt from "bcrypt";



export default class DoctorBaseRespository <T extends Document> {

    private model:Model<T>

    constructor(model:Model<T>){
        this.model=model

    }


    async findByEmail(email:string):Promise<DoctorInterface|null >{
        return await this.model.findOne({email:email})
    }
    async getDoctors():Promise<any >{
        return await this.model.find()
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


    async googleLogin(
        name: string,
        email: string,
        password: string,
        
    ): Promise<DoctorInterface | void> {
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



    async updateProfile(email:string,data: any) {
        try {
          
          const response = await DoctorModel.findOneAndUpdate(
            { email },
            {
              $set: 
                data
                
              ,
            },
            {
              new: true,
            }
          );
          return response
        } catch (error) {
          console.log(error);
        }
      }
}