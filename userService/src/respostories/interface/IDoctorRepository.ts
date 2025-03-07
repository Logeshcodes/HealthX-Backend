
import { DoctorInterface } from "../../models/doctorModel";
import { BannerInterface } from "../../models/bannerModel";


export interface IDoctorRepository{

    createDoctor( payload : DoctorInterface) : Promise <void> ;
    getDoctorData(email:string): Promise<DoctorInterface | null | undefined> ;
    updateProfile(email:string,data:object): Promise<DoctorInterface | null | undefined> ;
    updatePassword(email:string,password:string): Promise<DoctorInterface | null | undefined> ;
    VerificationRequest(emailID:string,status:string ,medicalLicenseUrl: string , degreeCertificateUrl : string ): Promise<DoctorInterface | null | undefined>
    updateWallet(doctorId : string , wallet : any) : Promise <DoctorInterface | null | undefined>;
    findAllBanners(): Promise <BannerInterface[] | null | undefined> ;
    getDoctors() : Promise<DoctorInterface[] | null | undefined>

   

}