import { UserInterface  } from "../../../models/userModel";
import { DoctorInterface } from "../../../models/doctorModel";
import { DepartmentInterface } from "../../../models/departmentModel";
import { AppointmentInterface } from "../../../models/appointmentModel";

export interface IUserBaseRepository{

    createUser(payload: UserInterface): Promise<void>
    getUserData(email: string): Promise<UserInterface | null>
    getDoctorDetails(email: string): Promise<DoctorInterface | null>
    updateProfile( email : string , data: object): Promise<UserInterface | null>
    updatePassword(email: string, password: string): Promise<UserInterface | null>

    findAllUsers(): Promise<UserInterface[] | null | undefined> 
    findAllDoctors() : Promise<DoctorInterface[] | null | undefined> 
    findAllDepartment(): Promise <DepartmentInterface[] | null | undefined>

    getAllAppointmentDetails(email: string, skip: number, limit: number , filter : string): Promise<AppointmentInterface[] | null | undefined>
    getAppointment(email: string): Promise<AppointmentInterface[] | null | undefined>

}