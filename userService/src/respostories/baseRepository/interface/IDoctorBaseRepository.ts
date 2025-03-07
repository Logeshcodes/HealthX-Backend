import { DoctorInterface } from "../../../models/doctorModel";
import { BannerInterface } from "../../../models/bannerModel";

export interface IDoctorBaseRepository{

    createDoctor(payload: DoctorInterface): Promise<DoctorInterface | null> ;
    getDoctorData(email: string): Promise<DoctorInterface | null | undefined>;
    updateProfile(email:string, data: object): Promise<DoctorInterface | null | undefined>;
    updatePassword(email: string, password: string): Promise<DoctorInterface | null | undefined> ;
    VerificationRequest(emailID: string, status: string ,medicalLicenseUrl: string , degreeCertificateUrl : string):  Promise<DoctorInterface | null | undefined>
    updateWallet(doctorId : string , wallet : any): Promise<DoctorInterface | null>
    findAllBanners() : Promise<BannerInterface[] | null | undefined> 
    getDoctors(): Promise<DoctorInterface[] | null | undefined>;
    
 
}