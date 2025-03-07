import { DoctorInterface } from "../../../models/doctorModel";

export interface IDoctorBaseRepository{

    createDoctor(payload: DoctorInterface): Promise<DoctorInterface | null> ;
 
}