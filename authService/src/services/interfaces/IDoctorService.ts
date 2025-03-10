
import { DoctorInterface } from "../../models/doctorModel";


export default interface IDoctorServices {
    findByEmail(email:string): Promise<DoctorInterface | null>;
    createUser(userData:DoctorInterface): Promise<DoctorInterface | null>;
    resetPassword(email:string,password:string): Promise<DoctorInterface | null>;
    updateProfile(email: string, profilePicture: string): Promise<void>
    blockDoctor(email : string, isBlocked : boolean ) : Promise<void>
   
}