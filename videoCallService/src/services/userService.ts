import { UserInterface } from "../models/userModel"
import { IUserService } from "./interface/IUserService"
import { IUserRepository } from "../respostories/interface/IUserRepository"


export default class UserServices implements IUserService{

    private userRepository:IUserRepository;
    constructor(userRepository :IUserRepository){
        this.userRepository= userRepository;
    }
    public async createUser(payload: UserInterface): Promise<void>{
        await this.userRepository.createUser(payload);
    }
}