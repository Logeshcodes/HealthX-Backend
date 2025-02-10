import { updateRequestType } from '../types/updateRequestType'
import { IVerificationModel } from '../models/verificationModel'


export interface IVerificationService{
    sendVerifyRequest(name:string,email:string , department: string , education: string,medicalLicenseUrl:string,degreeCertificateUrl:string):Promise<IVerificationModel>
    getRequestData(email:string):Promise<IVerificationModel | null>
    approveRequest(email:string,status:string):Promise<IVerificationModel | null>
    getAllRequests():Promise<IVerificationModel[] | null>
    updateRequest(email:string,data:updateRequestType):Promise<IVerificationModel | null>
}