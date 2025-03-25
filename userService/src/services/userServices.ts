import { UserInterface } from "../models/userModel"
import { DoctorInterface } from "../models/doctorModel"

import { BannerInterface } from "../models/bannerModel"
import { IUserService } from "./interface/IUserService"
import { IUserRepository } from "../respostories/interface/IUserRepository"
import { ReportInterface } from "../models/reportModel"



export default class UserServices implements IUserService{

    private userRepository:IUserRepository
    constructor(userRepository :IUserRepository){
        this.userRepository= userRepository

    }

    public async createUser(payload: UserInterface):Promise<UserInterface | null | undefined>{
        return await this.userRepository.createUser(payload);
    }

    public async updatePassword(email:string,password:string): Promise <UserInterface | null | undefined>{
        return await this.userRepository.updatePassword(email,password);
    }

    public async updateWallet(userId : string , wallet : any): Promise <UserInterface | null | undefined>{
        return await this.userRepository.updateWallet( userId , wallet);
    }

    public async getUserData(email:string): Promise<UserInterface | undefined | null> {
        try {
            return await this.userRepository.getUserData(email);
        } catch (error) {
            console.log(error)
            
        }
    }

    public async createReport(doctorId:string , userId :string,  reportType:string , description:string): Promise<ReportInterface| null | undefined> {
        try {

            return await this.userRepository.createReport(doctorId , userId ,  reportType , description);
        } catch (error) {
            console.log(error)
            
        }
    }

    public async getDoctorDetails(email:string): Promise <DoctorInterface | null | undefined>{
        try {
            return await this.userRepository.getDoctorDetails(email);
        } catch (error) {
            console.log(error);
        }
    }

    public async updateProfile(email: string,data:object): Promise<UserInterface | null | undefined>{
        try {
            return await this.userRepository.updateProfile(email ,data);
        } catch (error) {
            console.log(error);
        }
    }
   
    public async getUsers(): Promise <UserInterface[] | null | undefined>{
        try {
            return await this.userRepository.getUsers();
        } catch (error) {
            console.log(error)
        }
    }

    public async findAllBanners() : Promise <BannerInterface[] | null | undefined>{
        try {
            return await this.userRepository.findAllBanners();
        } catch (error) {
            console.log(error)
        }
    }

    public async findAllDoctors() : Promise <DoctorInterface[] | null | undefined>{
        try {
            return await this.userRepository.findAllDoctors();
        } catch (error) {
            console.log(error)
        }
    }

    public async findAllHomeDoctors() : Promise <DoctorInterface[] | null | undefined>{
        try {
            return await this.userRepository.findAllHomeDoctors();
        } catch (error) {
            console.log(error)
        }
    }
    
    public async findAllDepartment(){
        try {
            return await this.userRepository.findAllDepartment();
        } catch (error) {
            console.log(error)
        }
    }

    
    
}