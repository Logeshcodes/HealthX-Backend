import DoctorModel from "../models/doctorModel";

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
  


    public async createUser(userData:any){
        const response=await this.doctorRepository.createUser(userData)
        return response
    }
    public async resetPassword(email:string,password:string){
        const response=await this.doctorRepository.resetPassword(email,password)
        return response
    }





}