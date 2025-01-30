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
      

    public async updateProfile(email:string,data:any): Promise<any> {
        try {
            const response = await this.adminBaseRepository.updateProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    public async getDepartmentById(id:string): Promise<any> {
        try {
            const response = await this.adminBaseRepository.getDepartmentById(id);
            return response;
        } catch (error) {
            throw error;
        }
    }


    public async updateDepartment(id:string,data:any): Promise<any> {
        try {
            const response = await this.adminBaseRepository.updateDepartment(id,data);
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

}