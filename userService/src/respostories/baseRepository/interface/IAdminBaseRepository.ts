import { UserInterface } from "../../../models/userModel";
import { DoctorInterface } from "../../../models/doctorModel";
import { DepartmentInterface } from "../../../models/departmentModel";
import { BannerInterface } from "../../../models/bannerModel";

export interface IAdminBaseRepository{

    getAllUsers(): Promise<UserInterface[] | null>
    updateProfile(email: string, data: any): Promise<any>
    getUserData(email: string): Promise<UserInterface | null>

    getAllDoctors(): Promise<DoctorInterface[] | null>
    updateDoctorProfile(email: string, data: any): Promise<any>
    getDoctorByEmail( email: string): Promise<any>
    getDoctorData(email: string): Promise<DoctorInterface | null>

    createDepartment (departmentName : string) :Promise< DepartmentInterface|null>;
    findDepartmentByName(departmentName: string): Promise<DepartmentInterface | null>;
    getAllDepartments(): Promise<DepartmentInterface[] | null>
    getDepartmentByName( departmentName: string): Promise<any>
    updateDepartment( departmentName: string, data: any): Promise<any>   
    getBannerById( id: string): Promise<any>
    updateBanner( id : string, data: any): Promise<any>   

    addBanner( payload : BannerInterface) : Promise <void> ;
    getAllBanner(): Promise<BannerInterface[] | null | undefined>

}
