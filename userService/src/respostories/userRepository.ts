import UserModel, { UserInterface } from "../models/userModel";
import UserBaseRepository from "./baseRepository/userBaseRepository";
import { Model } from "mongoose";


export class UserRepository{
    private userBaseRepository:UserBaseRepository<UserInterface>
    constructor(){
        this.userBaseRepository=new UserBaseRepository(UserModel)

    }
    async createUser(payload:any){
        try {
            const response=await this.userBaseRepository.createUser(payload)
            
            
        } catch (error) {
            
        }
    }
    async getUserData(email:string){
        try {
            const response=await this.userBaseRepository.getUserData(email)
            console.log(response , ".")
            return response
            
        } catch (error) {
            
        }
    }
    async updateProfile(email: string,data:object){
        try {
            const response=await this.userBaseRepository.updateProfile( email ,data)
            console.log("update-repo",response)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    async updatePassword(email:string,password:string){
        try {
            const response=await this.userBaseRepository.updatePassword(email,password)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    async getUsers(){
        try {
            const response=await this.userBaseRepository.findAllUsers()
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }

    async findAllDoctors(){
        try {
            const response=await this.userBaseRepository.findAllDoctors()
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    
    
}