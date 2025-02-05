
import DoctorModel , {DoctorInterface} from "../models/doctorModel"


import IDoctorBaseRepository from "./baseRepositories/interfaces/IDoctorBaseRepository";
import IDoctorRepository from "./interfaces/IDoctorRepository";


export default class DoctorRepository implements IDoctorRepository{


    private baseRepository:IDoctorBaseRepository
    constructor(baseRepository:IDoctorBaseRepository){
        this.baseRepository=baseRepository

    }


    async findByEmail(email:string){
        const response = await this.baseRepository.findByEmail(email)
        return response
    }
   

    async createUser(userData:any) {
        const response= await this.baseRepository.createDoctor(userData)
        return response
    }
    
    async resetPassword(email:string,password:string) {
        const response= await this.baseRepository.resetPassword(email,password)
        return response
    }
   
}