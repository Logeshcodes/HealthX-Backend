import { DoctorInterface } from "../../models/doctorModel";

export interface IDoctorController {

    addDoctor(payload : DoctorInterface): Promise<void>;
   
}