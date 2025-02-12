import IUserRepository from "@/repositories/interfaces/IUserRepository";
import { UserInterface } from "../models/userModel";

import { UserRepository } from "../repositories/userRepository";

import IUserServices from "./interfaces/IUserServices";

class UserServices implements IUserServices{

    private userRepository : IUserRepository ;

    constructor(userRepository : IUserServices){
        this.userRepository = userRepository
    }

    public async findByEmail(email:string){
        const response=await this.userRepository.findByEmail(email)
        return response
    }

    public async createUser(userData:any){
        const response=await this.userRepository.createUser(userData)
        return response
    }


    public async googleLogin(name: string, email: string, password: string , profilePicture : string): Promise<UserInterface | null> {
      try {
          const response = await this.userRepository.googleLogin(name, email, password , profilePicture);
          return response;
      } catch (error) {
          throw error;
      }
  }

    public async resetPassword(email:string,password:string){
        const response=await this.userRepository.resetPassword(email,password)
        return response
    }

   


      public async updateProfile(email: string, profilePicture: string): Promise<UserInterface | null> {
        try {
          const response = await this.userRepository.updateProfile(email, profilePicture);
          return response || null;
        } catch (error) {
          throw error;
        }
      }
      

}

export default UserServices ;