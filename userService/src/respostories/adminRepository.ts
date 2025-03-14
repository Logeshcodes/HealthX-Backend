import { BannerInterface } from "../models/bannerModel";
import { IAdminRepository } from "./interface/IAdminRepository";

import { IAdminBaseRepository } from "./baseRepository/interface/IAdminBaseRepository";

export default class AdminRepository implements IAdminRepository{

    private adminBaseRepository : IAdminBaseRepository

    constructor( adminBaseRepository : IAdminBaseRepository){
        this.adminBaseRepository = adminBaseRepository
    }


    async createDepartment(departmentName : string) {
        return await this.adminBaseRepository.createDepartment(departmentName);
    }

    async findDepartmentByName(departmentName : string) {
        const response =  await this.adminBaseRepository.findDepartmentByName(departmentName)
        return response ;
    }


    async getAllDepartments() {
        const response = await this.adminBaseRepository.getAllDepartments();
        return response;
      }

    async getAllBanner() : Promise <BannerInterface[] | null | undefined>{
        const response = await this.adminBaseRepository.getAllBanner();
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
    public async getBannerById( id :string): Promise<any> {
        try {
            console.log("in repo", id )
            const response = await this.adminBaseRepository.getBannerById(id );
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

    public async updateBanner( id :string,data:any): Promise<any> {
        try {
            const response = await this.adminBaseRepository.updateBanner(id ,data);
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

     public async addBanner(payload: BannerInterface){
              try {
                  const response=await this.adminBaseRepository.addBanner(payload)
                  return response
              } catch (error) {
                  console.log(error)
                  
              }
          }

}