import { DoctorInterface } from "../../models/doctorModel";


export interface IDoctorService{

    createDoctor( payload : DoctorInterface) : Promise<void> ;
   
}