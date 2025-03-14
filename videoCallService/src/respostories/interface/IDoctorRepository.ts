import { DoctorInterface } from "../../models/doctorModel";

export interface IDoctorRepository{
    createDoctor( payload : DoctorInterface) : Promise <void> ;
}