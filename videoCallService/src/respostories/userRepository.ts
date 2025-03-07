import { IUserRepository } from "./interface/IUserRepository";
import { IUserBaseRepository } from "./baseRepository/interface/IUserBaseRepository";
import { UserInterface } from "../models/userModel";

export class UserRepository implements IUserRepository{

    private userBaseRepository: IUserBaseRepository
    constructor(userBaseRepository : IUserBaseRepository){
        this.userBaseRepository= userBaseRepository

    }
    async createUser(payload:UserInterface): Promise<void>{
        try {

            console.log('in the repository ', payload)
            const response=await this.userBaseRepository.createUser(payload)
            return response
            
        } catch (error) {
            
        }
    }
}