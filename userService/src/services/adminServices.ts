import AdminRepository from "../respostories/adminRespository";

import DepartmentModel , {DepartmentInterface} from "../models/departmentModel";

export default class AdminService{

    private adminRepository : AdminRepository 

    constructor(){
        this.adminRepository = new AdminRepository
    }




    async createDepartment(deptData : any) {
        const response =  await this.adminRepository.createDepartment(deptData)
        return response ;
    }

    async findDepartmentByName(departmentName : string) {
        const response =  await this.adminRepository.findDepartmentByName(departmentName)
        return response ;
    }


    async getAllDepartments() {
        const response = await this.adminRepository.getAllDepartments();
        return response;
      }
    async getAllUsers() {
        const response = await this.adminRepository.getAllUsers();
        return response;
      }
      
      async updateProfile(email : string, data: any): Promise<object | any> {
        try {
          const response = await this.adminRepository.updateProfile(email, data);
          return response;
        } catch (error) {
          throw error;
        }
      }

     
     


        async getDepartmentById(id: string): Promise<object | null> {
          try {

            const department = await this.adminRepository.getDepartmentById(id);  
            if (!department) {
              throw new Error('Department not found');
            }
            return department;
          } catch (error) {
            throw error;
          }
        }



         
        async updateDepartment(id: string, data: any): Promise<object | null> {
          try {
            
            const updatedDepartment = await this.adminRepository.updateDepartment(id, data);  // Update department by ID
            if (!updatedDepartment) {
              throw new Error('Department not found');
            }
            return updatedDepartment;
          } catch (error) {
            throw error;
          }
        }

      

      async getUserData(email:string){
        try {
            const response=await this.adminRepository.getUserData(email)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
      


}