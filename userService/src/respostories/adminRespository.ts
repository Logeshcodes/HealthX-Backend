import { AdminBaseRepository } from "./baseRepository/adminBaseRepository";

import DepartmentModel , {DepartmentInterface} from "../models/departmentModel";

export default class AdminRepository{

    private adminBaseRepository : AdminBaseRepository<DepartmentInterface>

    constructor(){
        this.adminBaseRepository = new AdminBaseRepository(DepartmentModel)
    }




    async createDepartment(deptData : any) {
        const response =  await this.adminBaseRepository.createDepartment(deptData)
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