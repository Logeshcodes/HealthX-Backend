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

    async getAllDoctors() {
        const response = await this.adminRepository.getAllDoctors();
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


      async updateDoctorProfile(email : string, data: any): Promise<object | any> {
        try {
          const response = await this.adminRepository.updateDoctorProfile(email, data);
          return response;
        } catch (error) {
          throw error;
        }
      }

     
     


        async getDepartmentByName(departmentName: string): Promise<object | null> {
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


        async getDoctorByEmail(email: string): Promise<object | null> {
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



         
        async updateDepartment(departmentName: string, data: any): Promise<object | null> {
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

      

      async getUserData(email:string){
        try {
            const response=await this.adminRepository.getUserData(email)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
      async getDoctorData(email:string){
        try {
            const response=await this.adminRepository.getDoctorData(email)
            return response
        } catch (error) {
            console.log(error)
            
        }
    }
      


}