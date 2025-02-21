import { UserInterface } from "../../models/userModel";
import { DoctorInterface } from "../../models/doctorModel";
import { Request, Response } from "express";
import { DepartmentInterface } from "../../models/departmentModel";
import { AppointmentInterface } from "../../models/appointmentModel";

export interface IUserRepository{

    createUser(payload : UserInterface) : Promise<void> ;
    getUserData( email : string ) : Promise <UserInterface | null | undefined> ;
    getDoctorDetails(email:string) : Promise <DoctorInterface | null | undefined> ;
    updateProfile(email: string,data:object) : Promise <UserInterface | null | undefined> ;
    updatePassword(email:string,password:string) : Promise <UserInterface | null | undefined>;
    getUsers(): Promise <UserInterface[] | null | undefined> ;
    findAllDoctors(): Promise <DoctorInterface[] | null | undefined> ;
    findAllDepartment(): Promise <DepartmentInterface[] | null | undefined> ;

    getAllAppointmentDetails(email: string, skip: number, limit: number  , filter : string): Promise<AppointmentInterface[] | null | undefined>
    getAppointment(email: string): Promise<AppointmentInterface[] | null | undefined>


}