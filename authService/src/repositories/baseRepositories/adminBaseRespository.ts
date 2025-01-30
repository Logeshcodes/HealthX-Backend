import { Document, Model } from "mongoose";

import DepartmentModel , {DepartmentInterface} from "../../models/departmentModel";
import UserModel , {UserInterface} from "../../models/userModel";
import DoctorModel , {DoctorInterface} from "../../models/doctorModel"

export class AdminBaseRepository<T extends Document> {

  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }




    async createDepartment (deptData : any) :Promise< DepartmentInterface|null>{

       try {

        // const existingDept = await DepartmentModel.findOne({ departmentName: deptData.departmentName });

        // if (existingDept) {
        //     throw new Error('Department already exists');
        // }

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
      



}