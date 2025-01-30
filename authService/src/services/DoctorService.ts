import DoctorModel from "../models/doctorModel";

import DoctorRespository from "../repositories/doctorRespository";

export default class DoctorService{

    private doctorRepository:DoctorRespository

    constructor(){
        this.doctorRepository=new DoctorRespository()

    }


    public async findByEmail(email:string){
        const response=await this.doctorRepository.findByEmail(email)
        return response
    }
    public async getDoctors(){
        const response=await this.doctorRepository.getDoctors()
        return response
    }


    public async createUser(userData:any){
        const response=await this.doctorRepository.createUser(userData)
        return response
    }
    public async resetPassword(email:string,password:string){
        const response=await this.doctorRepository.resetPassword(email,password)
        return response
    }
    
    public async googleLogin(name: string, email: string, password: string): Promise<object | void> {
        try {
            const response = await this.doctorRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }




    public async updateProfile(email:string,data:any): Promise<object | void> {
        try {
            const response = await this.doctorRepository.updateProfile(email,data);
            return response;
        } catch (error) {
            throw error;
        }
    }
}