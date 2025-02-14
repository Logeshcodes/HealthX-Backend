import AdminRepository from "../respostories/adminRepository";

import DepartmentModel , {DepartmentInterface} from "../models/departmentModel";
import { UserInterface } from "../models/userModel";
import { DoctorInterface } from "../models/doctorModel";

import { IAdminService } from "./interface/IAdminservice";
import { IAdminRepository } from "../respostories/interface/IAdminRepository";

export default class AdminService implements IAdminService{

    private adminRepository : IAdminRepository 

    constructor(adminRepository : IAdminRepository){
        this.adminRepository = adminRepository ;
    }


    
    async getAllDepartments(): Promise<DepartmentInterface[] | null | undefined > {
      const response = await this.adminRepository.getAllDepartments();
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

      

     
     
      


}