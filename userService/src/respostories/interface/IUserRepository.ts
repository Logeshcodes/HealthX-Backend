import { UserInterface } from "../../models/userModel";
import { DoctorInterface } from "../../models/doctorModel";
import { DepartmentInterface } from "../../models/departmentModel";
import { BannerInterface } from "../../models/bannerModel";
import { ReportInterface } from "../../models/reportModel";

export interface IUserRepository{

    createUser(payload : UserInterface) : Promise <UserInterface | null>;
    updatePassword(email:string,password:string) : Promise <UserInterface | null | undefined>;
    updateWallet(userId : string , wallet : any) : Promise <UserInterface | null | undefined>;

    getUserData( email : string ) : Promise <UserInterface | null | undefined> ;
    getDoctorDetails(email:string) : Promise <DoctorInterface | null | undefined> ;
    updateProfile(email: string,data:object) : Promise <UserInterface | null | undefined> ;
    getUsers(): Promise <UserInterface[] | null | undefined> ;
    findAllBanners(): Promise <BannerInterface[] | null | undefined> ;
    findAllDoctors(): Promise <DoctorInterface[] | null | undefined> ;
    findAllDepartment(): Promise <DepartmentInterface[] | null | undefined> ;
    createReport(doctorId:string , userId :string,  reportType:string , description:string): Promise<ReportInterface| null | undefined>;


}