import { UserInterface } from "../../models/userModel";
import { DoctorInterface } from "@/models/doctorModel";
import { DepartmentInterface } from "@/models/departmentModel";
import { Request, Response } from "express";


export interface IUserService{

    createUser( payload : UserInterface) : Promise<void>;
    getUserData( email : string ) :Promise<UserInterface | undefined | null> ;
    updateProfile(email: string,data:object) : Promise <UserInterface | null | undefined> ;
    updatePassword(email:string,password:string) : Promise <UserInterface | null | undefined> ;
    getUsers() : Promise <UserInterface[] | null | undefined> ;
    findAllDoctors() : Promise <DoctorInterface[] | null | undefined> ;
    findAllDepartment() : Promise <DepartmentInterface[] | null | undefined> ;
    getDoctorDetails(email:string) : Promise <DoctorInterface | null | undefined> ;

}