import { UserInterface  } from "../../../models/userModel";
import { DoctorInterface } from "../../../models/doctorModel";
import { DepartmentInterface } from "../../../models/departmentModel";

import { BannerInterface } from "../../../models/bannerModel";

export interface IUserBaseRepository{

    createUser(payload: UserInterface): Promise<void>
    getUserData(email: string): Promise<UserInterface | null>
    getDoctorDetails(email: string): Promise<DoctorInterface | null>
    updateProfile( email : string , data: object): Promise<UserInterface | null>
    updatePassword(email: string, password: string): Promise<UserInterface | null>
    updateWallet(userId : string , wallet : any): Promise<UserInterface | null>

    findAllUsers(): Promise<UserInterface[] | null | undefined> 
    findAllBanners() : Promise<BannerInterface[] | null | undefined> 
    findAllDoctors() : Promise<DoctorInterface[] | null | undefined> 
    findAllDepartment(): Promise <DepartmentInterface[] | null | undefined>


}