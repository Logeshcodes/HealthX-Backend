import { NextFunction } from "express"


import IUserRepository from "./interfaces/IUserRepository"
import { UserInterface } from "@/models/userModel"

export class UserRepository implements IUserRepository{

    private baseRepository : IUserRepository

    constructor(baseRepository : IUserRepository){
        this.baseRepository= baseRepository

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


    public async googleLogin(name: string, email: string, password: string, profilePicture : string): Promise<UserInterface | null> {
        try {
            const response = await this.baseRepository.googleLogin(name, email, password , profilePicture);
            return response;
        } catch (error) {
            throw error;
        }
    }


    public async updateProfile(email: string, profilePicture: string): Promise<any> {
        try {
            const response = await this.baseRepository.updateProfile(email,profilePicture);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
}
