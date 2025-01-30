import { UserInterface } from "../models/userModel";

import { UserRepository } from "../repositories/userRepository";


class UserServices{

    private userRepository : UserRepository ;

    constructor(){
        this.userRepository = new UserRepository()
    }

    public async findByEmail(email:string){
        const response=await this.userRepository.findByEmail(email)
        return response
    }

    public async createUser(userData:any){
        const response=await this.userRepository.createUser(userData)
        return response
    }

    public async resetPassword(email:string,password:string){
        const response=await this.userRepository.resetPassword(email,password)
        return response
    }

    public async googleLogin(name: string, email: string, password: string): Promise<object | void> {
        try {
            const response = await this.userRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }


    public async updateProfile(email:string,data:any): Promise<object | void> {
        try {
            const response = await this.userRepository.updateProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }

}

export default UserServices ;