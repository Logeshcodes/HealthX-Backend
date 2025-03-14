import { DoctorInterface } from "../models/doctorModel"
import { IDoctorService } from "./interface/IDocterService"
import { IDoctorRepository } from "../respostories/interface/IDoctorRepository"

export class DoctorServices implements IDoctorService{

    private doctorRepository:IDoctorRepository
    constructor(doctorRepository : IDoctorRepository){
        this.doctorRepository= doctorRepository

    }
    public async createDoctor(payload:DoctorInterface): Promise<void>{
        await this.doctorRepository.createDoctor(payload)
    }
}