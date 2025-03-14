import { IUserRepository } from "./interface/IUserRepository";
import UserModel, { UserInterface } from "../models/userModel";
import { GenericRespository } from "./GenericRepository.ts/GenericRepository";

export class UserRepository extends GenericRespository<UserInterface> implements IUserRepository{

    constructor(){
        super(UserModel);
    }

    async createUser(payload:UserInterface): Promise<void>{
        await this.create(payload);
    }
}