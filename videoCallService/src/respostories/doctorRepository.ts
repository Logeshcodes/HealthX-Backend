import { IDoctorRepository } from "./interface/IDoctorRepository";
import { IDoctorBaseRepository } from "./baseRepository/interface/IDoctorBaseRepository";
import { DoctorInterface } from "../models/doctorModel";

export class DoctorRepository implements IDoctorRepository{

    private doctorBaseRepository: IDoctorBaseRepository
    constructor( doctorBaseRepository : IDoctorBaseRepository){
        
        this.doctorBaseRepository= doctorBaseRepository

    }
    async createDoctor(payload: DoctorInterface){
        try {
            const response=await this.doctorBaseRepository.createDoctor(payload)
            
            
        } catch (error) {
            
        }
    }
}