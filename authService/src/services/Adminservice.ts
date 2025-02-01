import AdminRepository from "../repositories/adminRespository";

export default class AdminService{

    private adminRepository : AdminRepository ;

    constructor(){
        this.adminRepository = new AdminRepository()
    }

    
    public async createDepartment(deptData:any){

        const response=await this.adminRepository.createDepartment(deptData)
        return response
    }

    public async updateDepartment(departmentName:string , updateData : string ){

        const response=await this.adminRepository.updateDepartment(departmentName , updateData)
        return response
    }

    public async findDepartmentByName(departmentName : string){
        const response=await this.adminRepository.findDepartmentByName(departmentName)
        return response
    }
}