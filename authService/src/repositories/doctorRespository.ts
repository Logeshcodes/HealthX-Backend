
import DoctorModel , {DoctorInterface} from "../models/doctorModel"

import DoctorBaseRespository from "./baseRepositories/doctorBaseRespository";


export default class DoctorRespository{


    private baseRepository:DoctorBaseRespository<DoctorInterface>

    constructor(){
        this.baseRepository=new DoctorBaseRespository(DoctorModel)

    }


    async findByEmail(email:string){
        const response = await this.baseRepository.findByEmail(email)
        return response
    }
    async getDoctors(){
        const response = await this.baseRepository.getDoctors()
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
    public async googleLogin(name: string, email: string, password: string): Promise<object | void> {
        try {
            const response = await this.baseRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }


    public async updateProfile(email:string,data:any): Promise<any> {
        try {
            const response = await this.baseRepository.updateProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }
}