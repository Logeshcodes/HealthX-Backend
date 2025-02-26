import { UserInterface } from "../models/userModel"
import { DoctorInterface } from "../models/doctorModel"

import { BannerInterface } from "../models/bannerModel"
import { IUserService } from "./interface/IUserService"
import { IUserRepository } from "../respostories/interface/IUserRepository"

import { AppointmentInterface } from "../models/appointmentModel"

export default class UserServices implements IUserService{

    private userRepository:IUserRepository
    constructor(userRepository :IUserRepository){
        this.userRepository= userRepository

    }
    public async createUser(payload: UserInterface){
        try {
            const response=await this.userRepository.createUser(payload)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async getUserData(email:string): Promise<UserInterface | undefined | null> {
        try {
            const response=await this.userRepository.getUserData(email)
            console.log(response , 'getuserdata -service')
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async getDoctorDetails(email:string): Promise <DoctorInterface | null | undefined>{
        try {
            const response=await this.userRepository.getDoctorDetails(email)
            console.log(response , 'getDoctorDetails -service')
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updateProfile(email: string,data:object): Promise<UserInterface | null | undefined>{
        try {
            console.log("update-service")
            const response=await this.userRepository.updateProfile(email ,data)
            console.log("update-service",response)
            return response
            
        } catch (error) {
            console.log(error)
            
        }
    }
    public async updatePassword(email:string,password:string): Promise <UserInterface | null | undefined>{
        try {
            const response=await this.userRepository.updatePassword(email,password)
            return response
        } catch (error) {
            console.log(error)
        }
    }
    public async getUsers(): Promise <UserInterface[] | null | undefined>{
        try {
            const response=await this.userRepository.getUsers()
            return response
        } catch (error) {
            console.log(error)
        }
    }
    public async findAllBanners() : Promise <BannerInterface[] | null | undefined>{
        try {
            const response=await this.userRepository.findAllBanners()
            console.log("Banners ", response)
            return response
        } catch (error) {
            console.log(error)
        }
    }
    public async findAllDoctors() : Promise <DoctorInterface[] | null | undefined>{
        try {
            const response=await this.userRepository.findAllDoctors()
            console.log("doctor ", response)
            return response
        } catch (error) {
            console.log(error)
        }
    }
    
    public async findAllDepartment(){
        try {
            const response=await this.userRepository.findAllDepartment()
            console.log("doctor ", response)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    public async getAllAppointmentDetails(email: string , skip: number, limit: number , activeTab : string ): Promise<AppointmentInterface[] | null | undefined>{
        try {
            const response=await this.userRepository.getAllAppointmentDetails(email , skip , limit ,activeTab)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }

    public async getAppointment(email: string): Promise<AppointmentInterface[] | null | undefined>{
        try {
            const response=await this.userRepository.getAppointment(email )
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
    
}