import  {DepartmentInterface} from "../models/departmentModel";
import { UserInterface } from "../models/userModel";
import { DoctorInterface } from "../models/doctorModel";
import { BannerInterface } from "../models/bannerModel";
import { IAdminService } from "./interface/IAdminservice";
import { IAdminRepository } from "../respostories/interface/IAdminRepository";
import { ReportResponse } from "../types/reportType";

export default class AdminService implements IAdminService{

    private adminRepository : IAdminRepository 

    constructor(adminRepository : IAdminRepository){
        this.adminRepository = adminRepository ;
    }


    
    async getAllDepartments(): Promise<DepartmentInterface[] | null | undefined > {
      const response = await this.adminRepository.getAllDepartments();
      return response;
    }
    async getAllBanner(): Promise<BannerInterface[] | null | undefined> {
      const response = await this.adminRepository.getAllBanner();
      return response;
    }

  async getAllUsers(): Promise<UserInterface[] | null | undefined > {
      const response = await this.adminRepository.getAllUsers();
      return response;
    }

  async getAllDoctors(): Promise<DoctorInterface[] | null | undefined > {
      const response = await this.adminRepository.getAllDoctors();
      return response;
    }



      
    async updateProfile(email : string, data: any): Promise<UserInterface | null | undefined > {
        try {
          const response = await this.adminRepository.updateProfile(email, data);
          return response;
        } catch (error) {
          throw error;
        }
      }


      async getUserData(email:string) : Promise<UserInterface | null | undefined >{
        try {
            const response=await this.adminRepository.getUserData(email)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }



    async getDoctorData(email:string) : Promise<DoctorInterface | null | undefined>{
      try {
          const response=await this.adminRepository.getDoctorData(email)
          return response
      } catch (error) {
          console.log(error)
          
      }
  }




      async updateDoctorProfile(email : string, data: any): Promise<DoctorInterface | null | undefined > {
        try {
          const response = await this.adminRepository.updateDoctorProfile(email, data);
          return response;
        } catch (error) {
          throw error;
        }
      }


      
      async getDoctorByEmail(email: string): Promise<DoctorInterface | null | undefined > {
        try {
          console.log("in service" , email)

          const doctor = await this.adminRepository.getDoctorByEmail(email);  
          if (!doctor) {
            throw new Error('Department not found');
          }
          return doctor;
        } catch (error) {
          throw error;
        }
      }



      
        async createDepartment(departmentName : string): Promise<DepartmentInterface | null| undefined > {
            const response =  await this.adminRepository.createDepartment(departmentName)
            return response ;
        }

        async findDepartmentByName(departmentName : string): Promise<DepartmentInterface | null | undefined > {
            const response =  await this.adminRepository.findDepartmentByName(departmentName)
            return response ;
        }

     
     


        async getDepartmentByName(departmentName: string): Promise<DepartmentInterface | null | undefined> {
          try {
            console.log("in service" , departmentName)

            const department = await this.adminRepository.getDepartmentByName(departmentName);  
            if (!department) {
              throw new Error('Department not found');
            }
            return department;
          } catch (error) {
            throw error;
          }
        }

        async getBannerById(id: string): Promise< BannerInterface | null | undefined> {
          try {
            console.log("in service" , id)

            const banner = await this.adminRepository.getBannerById(id);  
            if (!banner) {
              throw new Error('banner not found');
            }
            return banner;
          } catch (error) {
            throw error;
          }
        }





         
        async updateDepartment(departmentName: string, data: any): Promise<DepartmentInterface | null | undefined> {
          try {
            
            const updatedDepartment = await this.adminRepository.updateDepartment( departmentName, data);  
            if (!updatedDepartment) {
              throw new Error('Department not found');
            }
            return updatedDepartment;
          } catch (error) {
            throw error;
          }
        }


        async updateBanner(id: string, data: any): Promise<BannerInterface | null | undefined> {
          try {
            
            const updatedBanner = await this.adminRepository.updateBanner( id, data);  
            if (!updatedBanner) {
              throw new Error('banner not found');
            }
            return updatedBanner;
          } catch (error) {
            throw error;
          }
        }

      
        public async addBanner(payload: BannerInterface) : Promise<any>{
          try {
              const response=await this.adminRepository.addBanner(payload)
              return response
          } catch (error) {
              console.log(error)
              
          }
      }



      public async getAllReport(page: number, limit: number, search: string): Promise<ReportResponse> {
        try {
            return await this.adminRepository.getAllReport(page, limit, search);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    

     
      
     
      


}