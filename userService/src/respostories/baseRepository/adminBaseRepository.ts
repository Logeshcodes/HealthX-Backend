import { Document, Model } from "mongoose";

import DepartmentModel , {DepartmentInterface} from "../../models/departmentModel"
import UserModel , {UserInterface} from "../../models/userModel";
import DoctorModel , {DoctorInterface} from "../../models/doctorModel"
import { IAdminBaseRepository } from "./interface/IAdminBaseRepository";
import BannerModel, { BannerInterface } from "../../models/bannerModel";
import ReportModel, { ReportInterface } from "../../models/reportModel";
import { ReportResponse } from "../../types/reportType";
import AdminModel, { AdminInterface } from "../../models/adminModel";

export class AdminBaseRepository implements IAdminBaseRepository {


  async createAdmin(payload: AdminInterface): Promise<void> {
    try {
      await AdminModel.create(payload);
    } catch (error) {
      throw error;
    }
  }
  

    async createDepartment (departmentName : string) :Promise< DepartmentInterface|null>{

       try {

        const dept = await DepartmentModel.create({departmentName})
        console.log("dept data : " , dept)
        await dept.save()

        return dept 
        
       } catch (error) {
            throw error
       }
    }

    async findDepartmentByName(departmentName: string): Promise<DepartmentInterface | null> {
        return await DepartmentModel.findOne({
          departmentName: { $regex: new RegExp(`^${departmentName}$`, 'i') }, 
        });
      }
      



      async getAllDepartments(): Promise<DepartmentInterface[] | null> {
        try {
          const departments = await DepartmentModel.find();
          console.log("All departments: ", departments);
          return departments;
        } catch (error) {
          throw error;
        }
      }
      async getAllBanner(): Promise< BannerInterface[] | null | undefined> {
        try {
          const banners = await BannerModel.find();
          console.log("All banners: ", banners);
          return banners;
        } catch (error) {
          throw error;
        }
      }

      async getAllReport(page: number, limit: number, search: string): Promise<ReportResponse> {
        try {
            const query = search ? { reportType: { $regex: search, $options: "i" } } : {};
            
            const reports = await ReportModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit);
            
            const totalReports = await ReportModel.countDocuments(query);
            
            return { reports, totalPages: Math.ceil(totalReports / limit) };
        } catch (error) {
            throw error;
        }
    }
    

      async getAllUsers(): Promise<UserInterface[] | null> {
        try {
          const users = await UserModel.find();
          console.log("All users: ", users);
          return users;
        } catch (error) {
          throw error;
        }
      }

      async getAllDoctors(): Promise<DoctorInterface[] | null> {
        try {
          const doctors = await DoctorModel.find();
          console.log("All doctors: ", doctors);
          return doctors;
        } catch (error) {
          throw error;
        }
      }

      async getAdminData(): Promise<AdminInterface | null> {
        try {
          const admin = await AdminModel.findOne();
          console.log("Admin data: ", admin);
          return admin;
        } catch (error) {
          throw error;
        }
      }


      public async updateProfile(email: string, data: any): Promise<any> {
        try {
          const response = await UserModel.findOneAndUpdate(
            { email },
            { $set: data },
            { new: true }
          );
          return response;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }

      public async updateDoctorProfile(email: string, data: any): Promise<any> {
        try {
          console.log(data , " data details")
          const response = await DoctorModel.findOneAndUpdate(
            { email },
            { $set: data },
            { new: true }
          );

          console.log('confirm repsonse' , response)
          return response;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }

      public async updateWallet(data: any): Promise<any> {
        try {
            const email = "admin@gmail.com";
            console.log(email, data, " data details");
    
            const response = await AdminModel.findOneAndUpdate(
                { email },
                {
                    $set: {
                      
                        "wallet.balance": data.balance,
                        "wallet.transactions": data.transactions,
                    }
                },
                { new: true }
            );
    
            console.log('confirm response admin:', response);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    

      public async getDepartmentByName( departmentName: string): Promise<any> {
        try {
         console.log("finding dept", departmentName)
        const response = await DepartmentModel.find({departmentName});  
        console.log("first ,,", response) 
          return response; 
          
        } catch (error) {
          console.error('Error fetching department by name:', error);
          throw error; 
        }
      }


      public async getBannerById( id : string): Promise<any> {
        try {
         console.log("finding banner", id )
        const response = await BannerModel.findOne({_id : id});  
        console.log("first ,,", response) 
          return response; 
          
        } catch (error) {
          console.error('Error fetching Banner by id:', error);
          throw error; 
        }
      }

      public async getDoctorByEmail( email: string): Promise<any> {
        try {
         console.log("finding dept", email)
        const response = await DoctorModel.find({email});  
        console.log("resp,,,", response) 
          return response; 
          
        } catch (error) {
          console.error('Error fetching department by name:', error);
          throw error; 
        }
      }
      

     
      public async updateDepartment( departmentName: string, data: any): Promise<any> {
        try {
         console.log("data",data)
          const response = await DepartmentModel.findOneAndUpdate(
            {departmentName},            
            { $set: data }, 
            { new: true }   
          );

          console.log(response, "response....")
          return response;  
        } catch (error) {
          console.log(error);
          throw error;  
        }
      }

      
      public async updateBanner( id: string, data: any): Promise<any> {
        try {
         console.log("data",data)
          const response = await BannerModel.findByIdAndUpdate(
             id,            
            { $set: data }, 
            { new: true }   
          );

          console.log(response, "response....")
          return response;  
        } catch (error) {
          console.log(error);
          throw error;  
        }
      }
      


      async getUserData(email: string): Promise<UserInterface | null> {
        try {
          const userData = await UserModel.findOne({ email: email });
          return userData;
        } catch (error) {
          throw error;
        }
      }

      async getDoctorData(email: string): Promise<DoctorInterface | null> {
        try {
          const doctorData = await DoctorModel.findOne({ email: email });
          return doctorData;
        } catch (error) {
          throw error;
        }
      }
      
      
      async addBanner(payload: BannerInterface): Promise<any> {
        try {
            console.log('create banner:', payload);
            const banner = await BannerModel.create(payload);
            console.log('banner added:', banner);
            return banner;
        } catch (error) {
            console.error('Error banner add:', error);
            throw error;
        }
    }
    



}