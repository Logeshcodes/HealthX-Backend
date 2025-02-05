
import { DoctorInterface } from "@/models/doctorModel";

export default interface IDoctorRepository {
    findByEmail(email:string): Promise<DoctorInterface | null>;
    createUser(userData:any): Promise<DoctorInterface | null>;
    resetPassword(email:string,password:string): Promise<DoctorInterface | null>;
    
   
}