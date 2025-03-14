import { UserInterface } from "../../models/userModel";
import { DoctorInterface } from "../../models/doctorModel";
import { DepartmentInterface } from "../../models/departmentModel";
import { BannerInterface } from "../../models/bannerModel";

export interface IUserService{

    createUser( payload : UserInterface) :Promise<UserInterface | null | undefined>;
    updatePassword(email:string,password:string) : Promise <UserInterface | null | undefined> ;
    updateWallet(userId : string , wallet : any) : Promise <UserInterface | null | undefined> ;

    getUserData( email : string ) :Promise<UserInterface | undefined | null> ;
    updateProfile(email: string,data:object) : Promise <UserInterface | null | undefined> ;
    getUsers() : Promise <UserInterface[] | null | undefined> ;
    findAllBanners() : Promise <BannerInterface[] | null | undefined> ;
    findAllDoctors() : Promise <DoctorInterface[] | null | undefined> ;
    findAllDepartment() : Promise <DepartmentInterface[] | null | undefined> ;
    getDoctorDetails(email:string) : Promise <DoctorInterface | null | undefined> ;



}