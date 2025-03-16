import { DepartmentInterface } from "../../models/departmentModel";
import { UserInterface } from "../../models/userModel";
import { DoctorInterface } from "../../models/doctorModel";
import { BannerData } from "../../types/bannerType";
import { BannerInterface } from "../../models/bannerModel";
import { ReportResponse } from "../../types/reportType";

export interface IAdminService{
    
    getAllUsers() : Promise <UserInterface[] | null | undefined>
    updateProfile(email : string, data: any): Promise <UserInterface | null | undefined> ;
    getUserData(email:string) : Promise <UserInterface | null | undefined> ;
    
    getAllDoctors(): Promise <DoctorInterface[] | null | undefined>
    getDoctorByEmail(email: string): Promise <DoctorInterface | null | undefined>
    updateDoctorProfile(email : string, data: any): Promise <DoctorInterface | null | undefined>;
    getDoctorData(email:string)  : Promise <DoctorInterface | null | undefined>
    
    
    getDepartmentByName(departmentName: string): Promise <DepartmentInterface | null | undefined>
    updateDepartment(departmentName: string, data: any): Promise <DepartmentInterface | null | undefined>
    getBannerById(id: string): Promise <BannerInterface | null | undefined>
    updateBanner(id: string, data: any): Promise <BannerInterface | null | undefined>
    createDepartment(departmentName : string ): Promise <DepartmentInterface | null | undefined>;
    findDepartmentByName(departmentName : string ) : Promise <DepartmentInterface | null | undefined> ;
    getAllDepartments(): Promise <DepartmentInterface[] | null | undefined>;

    addBanner(payload : BannerData) : Promise <any> ;
    getAllBanner() : Promise < BannerInterface[] | null | undefined> ;
    getAllReport(page: number, limit: number, search: string) : Promise < ReportResponse> ;

}