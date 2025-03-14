import { IDoctorRepository } from "./interface/IDoctorRepository";
import DoctorModel ,{ DoctorInterface } from "../models/doctorModel";
import { GenericRespository } from "./GenericRepository.ts/GenericRepository";

export class DoctorRepository extends GenericRespository<DoctorInterface> implements IDoctorRepository{

    constructor(){
        super(DoctorModel)
    }
    async createDoctor(payload: DoctorInterface){
        await this.create(payload);
    }
}