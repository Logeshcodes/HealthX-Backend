import { NextFunction } from "express"

import UserBaseRepository from "./baseRepositories/userBaseRepository"

import UserModel , {UserInterface} from "../models/userModel"

export class UserRepository{

    private baseRepository :UserBaseRepository<UserInterface>

    constructor(){
        this.baseRepository=new UserBaseRepository(UserModel)

    }

    async findByEmail(email:string){
        const response = await this.baseRepository.findByEmail(email)
        return response
    }

    async createUser(userData:any) {
        const response= await this.baseRepository.createUser(userData)
        return response
    }

    async resetPassword(email:string,password:string) {
        const response= await this.baseRepository.resetPassword(email,password)
        return response
    }

    public async googleLogin(name: string, email: string, password: string): Promise<object | void> {
        try {
            const response = await this.baseRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }



    public async updateProfile(email:string,data:any): Promise<any> {
        try {
            const response = await this.baseRepository.updateProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
}
