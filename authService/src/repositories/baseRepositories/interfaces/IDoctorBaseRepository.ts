
import { DoctorInterface } from "../../../models/doctorModel";
import { DepartmentInterface } from "../../../models/departmentModel";

export default interface IDoctorBaseRepository {
    findByEmail(email:string): Promise<DoctorInterface | null>;
    createDoctor(userData:any): Promise<DoctorInterface | null>;
    resetPassword(email:string,password:string): Promise<DoctorInterface | null>;
    getAllDepartments():Promise<DepartmentInterface[] | null> ;
    updateProfile( email: string, profilePicture: string): Promise<  void>
    blockDoctor(email : string, isBlocked : boolean  , status : string  ) : Promise<void>
    googleLogin(name: string, email: string, password: string): Promise<DoctorInterface | null>;
}