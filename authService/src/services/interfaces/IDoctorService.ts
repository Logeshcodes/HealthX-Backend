import { DepartmentInterface } from "@/models/departmentModel";
import { DoctorInterface } from "../../models/doctorModel";


export default interface IDoctorServices {
    findByEmail(email:string): Promise<DoctorInterface | null>;
    createUser(userData:any): Promise<DoctorInterface | null>;
    resetPassword(email:string,password:string): Promise<DoctorInterface | null>;

    getAllDepartments():Promise<DepartmentInterface[] | null> ;
    updateProfile(email: string, profilePicture: string): Promise<void>
    blockDoctor(email : string, isBlocked : boolean  , status : string  ) : Promise<void>
    googleLogin(name: string, email: string, password: string): Promise<DoctorInterface | null>;
   
}