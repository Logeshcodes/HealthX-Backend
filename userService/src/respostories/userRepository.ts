import UserModel, { UserInterface } from "../models/userModel";
import { DoctorInterface } from "../models/doctorModel";
import { DepartmentInterface } from "../models/departmentModel";
import { BannerInterface } from "../models/bannerModel";

import { IUserRepository } from "./interface/IUserRepository";
import { IUserBaseRepository } from "./baseRepository/interface/IUserBaseRepository";


export class UserRepository implements IUserRepository{

    private userBaseRepository: IUserBaseRepository
    constructor(userBaseRepository : IUserBaseRepository){
        this.userBaseRepository= userBaseRepository

    }
    async createUser(payload:UserInterface): Promise<void>{
        try {

            console.log('in the repository ', payload)
            const response=await this.userBaseRepository.createUser(payload)
            return response
            
        } catch (error) {
            
        }
    }
    async getUserData(email:string):   Promise <UserInterface | null | undefined>{
        try {
            const response=await this.userBaseRepository.getUserData(email)
            console.log(response , ".")
            return response
            
        } catch (error) {
            
        }
    }
    async getDoctorDetails(email:string) : Promise<DoctorInterface | null | undefined>{
        try {
            const response=await this.userBaseRepository.getDoctorDetails(email)
            console.log(response , ".")
            return response
            
        } catch (error) {
            
        }
    }
    async updateProfile(email: string,data:object) : Promise <UserInterface | null | undefined>{
        try {
            const response=await this.userBaseRepository.updateProfile( email ,data)
            console.log("update-repo",response)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    async updatePassword(email:string,password:string): Promise <UserInterface | null | undefined>{
        try {
            const response=await this.userBaseRepository.updatePassword(email,password)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    async updateWallet(userId : string , wallet : any ): Promise <UserInterface | null | undefined>{
        try {
            const response=await this.userBaseRepository.updateWallet( userId ,  wallet)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    async getUsers(): Promise <UserInterface[] | null | undefined>{
        try {
            const response=await this.userBaseRepository.findAllUsers()
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }

    async findAllBanners(): Promise <BannerInterface[] | null | undefined>{
        try {
            const response=await this.userBaseRepository.findAllBanners()
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }

    async findAllDoctors(): Promise <DoctorInterface[] | null | undefined>{
        try {
            const response=await this.userBaseRepository.findAllDoctors()
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    
    async findAllDepartment(): Promise <DepartmentInterface[] | null | undefined>{
        try {
            const response=await this.userBaseRepository.findAllDepartment()
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }

  
    
    
    
}