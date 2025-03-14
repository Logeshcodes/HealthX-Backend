import { updateRequestType } from "../types/updateRequestType";
import { IVerificationModel } from "../models/verificationModel";

export interface IVerificationRepository{
    sendVerifyRequest(VerifyData : IVerificationModel):Promise<IVerificationModel >
    getRequestDataByEmail(email:string):Promise<IVerificationModel | null>
    getAllRequests():Promise<IVerificationModel[] | null>
    approveRequest(email:string,status:string):Promise<IVerificationModel | null>
}