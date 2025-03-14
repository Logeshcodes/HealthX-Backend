import UserModel, { UserInterface } from "../models/userModel";
import DoctorModel, { DoctorInterface } from "../models/doctorModel";
import DepartmentModel, { DepartmentInterface } from "../models/departmentModel";
import BannerModel, { BannerInterface } from "../models/bannerModel";
import { IUserRepository } from "./interface/IUserRepository";
import { GenericRespository } from "./GenericRepository.ts/GenericRepository"

export class UserRepository extends GenericRespository<UserInterface> implements IUserRepository{

    constructor(){
        super(UserModel)
    }

    async createUser(payload:UserInterface): Promise <UserInterface | null>{
        return await this.create(payload);
    }

    async updatePassword(email:string,password:string): Promise <UserInterface | null | undefined>{
       return await this.update(email,{hashedPassword : password});
    }

    async updateWallet(userId : string , wallet : any ): Promise <UserInterface | null | undefined>{
        return await this.findIdAndUpdate( userId ,  {data : wallet });
    }
    
    async getUserData(email:string):   Promise <UserInterface | null | undefined>{
        try {
            return await this.findOne({email}); 
        } catch (error) {
            throw error ;
        }
    }

    async getDoctorDetails(email:string) : Promise<DoctorInterface | null | undefined>{
        try {
            return await DoctorModel.findOne({ email : email });
        } catch (error) {
            throw error ;
        }
    }

    async updateProfile(email: string,data:object) : Promise <UserInterface | null | undefined>{
        try {
            return await this.update( email ,data);
        } catch (error) {
            console.log(error); 
        }
    }
    
   
    async getUsers(): Promise <UserInterface[] | null | undefined>{
        try {
            return await this.find(); 
        } catch (error) {
            console.log(error);  
        }
    }

    async findAllBanners(): Promise <BannerInterface[] | null | undefined>{
        try {
            const currentDate = new Date();

            return await BannerModel.find({
                isListed: true,
                role: "Patient",
                startDate: { $lte: currentDate }, 
                endDate: { $gte: currentDate }    
              });
        } catch (error) {
            console.log(error);
        }
    }

    async findAllDoctors(): Promise <DoctorInterface[] | null | undefined>{
        try {
            return await DoctorModel.find({isBlocked: false , status : "approved"})
        } catch (error) {
            console.log(error); 
        }
    }
    
    async findAllDepartment(): Promise <DepartmentInterface[] | null | undefined>{
        try {
            return await DepartmentModel.find()
        } catch (error) {
            console.log(error);
        }
    }

  
    
}