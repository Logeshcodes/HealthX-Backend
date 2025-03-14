import { updateRequestType } from "../types/updateRequestType";
import { IVerificationRepository } from "./IVerificationRepository" ;
import VerificationModel ,{ IVerificationModel } from "../models/verificationModel";
import { GenericRespository } from "./GenericRepository.ts/GenericRepository";


export class VerificationRepository extends GenericRespository<IVerificationModel> implements IVerificationRepository {

    constructor(){
        super(VerificationModel);
    }
    
    async sendVerifyRequest( payload : IVerificationModel):Promise<IVerificationModel >{
       return await this.create(payload);
    }

    async getRequestDataByEmail(email:string):Promise<IVerificationModel | null>{
        try {
            return await this.findOne(email)
        } catch (error) {
            throw new Error("Verify Request Document failed Creation");
        }
    }

    async getAllRequests():Promise<IVerificationModel[] | null>{
        try {
            return await this.find();
        } catch (error) {
            throw new Error("Verify Request Document failed Creation");
        }
    }

    async approveRequest(email:string,status:string):Promise<IVerificationModel | null>{
        try {
            return await this.update(email,{status : status})
        } catch (error) {
            throw new Error("Verify Request Document failed Creation");
        }
    }
 

}