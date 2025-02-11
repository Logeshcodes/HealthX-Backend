import { IVerificationRepository } from "../respository/IVerificationRepository"
import {IVerificationService} from './IVerificationService'
import { IVerificationModel } from '../models/verificationModel'
import { updateRequestType } from '../types/updateRequestType'

export class VerificationService implements IVerificationService{
    
    private verificationRepository:IVerificationRepository
    constructor(verificationRepository:IVerificationRepository){
        this.verificationRepository=verificationRepository
    }
    async sendVerifyRequest(name:string,email:string, department: string , education: string,medicalLicenseUrl:string,degreeCertificateUrl:string):Promise<IVerificationModel>{
        try {
            console.log(name,email,medicalLicenseUrl,degreeCertificateUrl,"verificationnnn serviceee")
            const response=await this.verificationRepository.sendVerifyRequest(name,email, department , education,medicalLicenseUrl,degreeCertificateUrl)
            console.log("verification...serviceeee")
            return response
        } catch (error) {
            throw new Error("Verify Request Document failed Creation")
            
            
        }
    }
    async getRequestData(email:string):Promise<IVerificationModel | null>{
        try {
            console.log(email,"verificationnnn serviceee")
            const response=await this.verificationRepository.getRequestDataByEmail(email)
            return response
        } catch (error) {
            throw new Error("Verify Request Document failed Creation")
            
            
        }
    }
    async updateRequest(email:string,data:updateRequestType):Promise<IVerificationModel | null>{
        try {
            console.log(email,"updateRequest serviceee")
            const response=await this.verificationRepository.updateRequest(email,data)
            return response
        } catch (error) {
            throw new Error("Verify Request Document failed Creation")
            
            
        }
    }
    async getAllRequests():Promise<IVerificationModel[] | null>{
        try {
            console.log("getAllRequests verificationnnn serviceee")
            const response=await this.verificationRepository.getAllRequests()
            return response
        } catch (error) {
            throw new Error("Verify Request Document failed Creation")
            
            
        }
    }
    async approveRequest(email:string,status:string):Promise<IVerificationModel | null>{
        try {
            console.log(email,"verificationnnn serviceee")
            const response=await this.verificationRepository.approveRequest(email,status)
            return response
        } catch (error) {
            console.log(error)
            throw new Error("Verify Request Document failed Creation")
            
            
        }
    }


   
}