import { OtpInterface } from "../../models/otpModel"


export default interface IOtpRepository {
    findOtp(email:string): Promise<OtpInterface | null> ;
    deleteOtp(email:string): Promise<void> ;
    createOtp(email:string,otp:string): Promise<OtpInterface | null> ;  
}