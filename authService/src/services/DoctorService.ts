import DoctorModel, { DoctorInterface } from "../models/doctorModel";

import DoctorRespository from "../repositories/doctorRespository";
import IDoctorRepository from "@/repositories/interfaces/IDoctorRepository";
import IDoctorServices from "./interfaces/IDoctorService";

export default class DoctorService implements IDoctorServices{

    private doctorRepository:IDoctorRepository

    constructor(instructorRepository:IDoctorRepository){
        this.doctorRepository=instructorRepository

    }


    public async findByEmail(email:string){
        const response=await this.doctorRepository.findByEmail(email)
        return response
    }
  
    // show dept -signup

    async getAllDepartments() {
        const response = await this.doctorRepository.getAllDepartments();
        return response;
      }


    public async createUser(userData:any){
        const response=await this.doctorRepository.createUser(userData)
        return response
    }
    public async resetPassword(email:string,password:string){
        const response=await this.doctorRepository.resetPassword(email,password)
        return response
    }


    public async googleLogin(name: string, email: string, password: string): Promise<DoctorInterface | null> {
        try {
            const response = await this.doctorRepository.googleLogin(name, email, password);
            return response;
        } catch (error) {
            throw error;
        }
    }

  


}