import { Document, Model } from "mongoose";

import DepartmentModel , {DepartmentInterface} from "../../models/departmentModel"
import UserModel , {UserInterface} from "../../models/userModel";
import DoctorModel , {DoctorInterface} from "../../models/doctorModel"

export class AdminBaseRepository<T extends Document> {

  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }




    async createDepartment (deptData : any) :Promise< DepartmentInterface|null>{

       try {

        const dept = await DepartmentModel.create(deptData)
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
      


      async getUserData(email: string): Promise<UserInterface | null> {
        try {
          const studentData = await UserModel.findOne({ email: email });
          return studentData;
        } catch (error) {
          throw error;
        }
      }
      
      
      



}