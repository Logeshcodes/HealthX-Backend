import { AdminBaseRepository } from "./baseRepository/adminBaseRepository";

import DepartmentModel , {DepartmentInterface} from "../models/departmentModel";

import { IAdminRepository } from "./interface/IAdminRepository";

import { IAdminBaseRepository } from "./baseRepository/interface/IAdminBaseRepository";

export default class AdminRepository implements IAdminRepository{

    private adminBaseRepository : IAdminBaseRepository

    constructor( adminBaseRepository : IAdminBaseRepository){
        this.adminBaseRepository = adminBaseRepository
    }




    async createDepartment(departmentName : string) {
        const response =  await this.adminBaseRepository.createDepartment(departmentName)
        return response ;
    }

    async findDepartmentByName(departmentName : string) {
        const response =  await this.adminBaseRepository.findDepartmentByName(departmentName)
        return response ;
    }


    async getAllDepartments() {
        const response = await this.adminBaseRepository.getAllDepartments();
        return response;
      }

    async getAllUsers() {
        const response = await this.adminBaseRepository.getAllUsers();
        return response;
      }
      
    async getAllDoctors() {
        const response = await this.adminBaseRepository.getAllDoctors();
        return response;
      }
      

    public async updateProfile(email:string,data:any): Promise<any> {
        try {
            const response = await this.adminBaseRepository.updateProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    public async updateDoctorProfile(email:string,data:any): Promise<any> {
        try {
            const response = await this.adminBaseRepository.updateDoctorProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    public async getDepartmentByName( departmentName:string): Promise<any> {
        try {
            console.log("in repo", departmentName)
            const response = await this.adminBaseRepository.getDepartmentByName(departmentName);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    public async getDoctorByEmail( email:string): Promise<any> {
        try {
            console.log("in repo", email)
            const response = await this.adminBaseRepository.getDoctorByEmail(email);
            return response;
        } catch (error) {
            throw error;
        }
    }


    public async updateDepartment( departmentName:string,data:any): Promise<any> {
        try {
            const response = await this.adminBaseRepository.updateDepartment(departmentName,data);
            return response;
        } catch (error) {
            throw error;
        }
    }


    async getUserData(email:string){
        try {
            const response=await this.adminBaseRepository.getUserData(email)
            return response
            
        } catch (error) {
            
        }
    }
    async getDoctorData(email:string){
        try {
            const response=await this.adminBaseRepository.getDoctorData(email)
            return response
            
        } catch (error) {
            
        }
    }

}