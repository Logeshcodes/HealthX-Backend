import { UserInterface } from "../../models/userModel";
import { DoctorInterface } from "../../models/doctorModel";
import { DepartmentInterface } from "../../models/departmentModel";
import { BannerInterface } from "../../models/bannerModel";
import { Request, Response } from "express";


export interface IAdminRepository{

   


    getAllUsers() : Promise <UserInterface[] | null | undefined>
    updateProfile(email:string,data:any) : Promise <UserInterface | null | undefined>
    getUserData(email:string) : Promise <UserInterface | null | undefined>


    getAllDoctors() : Promise <DoctorInterface[] | null | undefined>
    updateDoctorProfile(email:string,data:any) : Promise <DoctorInterface | null | undefined>
    getDoctorByEmail( email:string): Promise <DoctorInterface | null | undefined>
    getDoctorData(email:string) : Promise <DoctorInterface | null | undefined>

    createDepartment(departmentName : string) : Promise <DepartmentInterface | null | undefined>
    findDepartmentByName(departmentName : string) : Promise <DepartmentInterface | null | undefined>
    getAllDepartments() : Promise <DepartmentInterface[] | null | undefined>
    getDepartmentByName( departmentName:string) : Promise < DepartmentInterface >
    updateDepartment( departmentName:string,data:any) : Promise <DepartmentInterface> ;
    getBannerById( id :string) : Promise < BannerInterface >
    updateBanner( id :string,data:any) : Promise <BannerInterface> ;

    addBanner( payload : BannerInterface) : Promise <void> ;
    getAllBanner() : Promise <BannerInterface[] | null | undefined>

}