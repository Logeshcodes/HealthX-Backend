import { AdminBaseRepository } from "./baseRepositories/adminBaseRespository";

import DepartmentModel , {DepartmentInterface} from "../models/departmentModel";

export default class AdminRepository{

    private adminRepository : AdminBaseRepository<DepartmentInterface>

    constructor(){
        this.adminRepository = new AdminBaseRepository(DepartmentModel)
    }




    async createDepartment(deptData : any) {
        const response =  await this.adminRepository.createDepartment(deptData)
        return response ;
    }

    async findDepartmentByName(departmentName : string) {
        const response =  await this.adminRepository.findDepartmentByName(departmentName)
        return response ;
    }





}