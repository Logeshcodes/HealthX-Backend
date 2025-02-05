
import { DoctorInterface } from "@/models/doctorModel";


export default interface IDoctorBaseRepository {
    findByEmail(email:string): Promise<DoctorInterface | null>;
    createDoctor(userData:any): Promise<DoctorInterface | null>;
    resetPassword(email:string,password:string): Promise<DoctorInterface | null>;
    
   
}