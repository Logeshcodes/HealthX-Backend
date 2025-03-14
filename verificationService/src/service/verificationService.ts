import { IVerificationRepository } from "../respository/IVerificationRepository"
import {IVerificationService} from './IVerificationService'
import VerificationModel, { IVerificationModel } from '../models/verificationModel'
import { updateRequestType } from '../types/updateRequestType'
import { String } from "aws-sdk/clients/acm"

export class VerificationService implements IVerificationService{
    
    private verificationRepository:IVerificationRepository
    constructor(verificationRepository:IVerificationRepository){
        this.verificationRepository=verificationRepository
    }

    async sendVerifyRequest(name:string,email:string,medicalLicenseUrl:string,degreeCertificateUrl:string , status : String):Promise<IVerificationModel>{
        try {
            const data = new VerificationModel({ name,email,medicalLicenseUrl,degreeCertificateUrl,status});
            return await this.verificationRepository.sendVerifyRequest(data);
        } catch (error) {
            throw new Error("Verify Request Document failed Creation")
        }
    }

    async getRequestData(email:string):Promise<IVerificationModel | null>{
        try {
            return await this.verificationRepository.getRequestDataByEmail(email)
        } catch (error) {
            throw new Error("get data  failed Creation");  
        }
    }


    async getAllRequests():Promise<IVerificationModel[] | null>{
        try {
            return await this.verificationRepository.getAllRequests()
        } catch (error) {
            throw new Error("get all requests failed Creation"); 
        }
    }


    async approveRequest(email:string,status:string):Promise<IVerificationModel | null>{
        try {
            return await this.verificationRepository.approveRequest(email,status);
        } catch (error) {
            console.log(error)
            throw new Error("approve Document failed Creation");
        }
    }


   
}