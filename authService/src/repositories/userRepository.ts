import IUserRepository from "./interfaces/IUserRepository"
import UserModel , { UserInterface } from "../models/userModel"
import { GenericRespository } from "./GenericRepository.ts/GenericRepository"


export class UserRepository extends GenericRespository<UserInterface> implements IUserRepository{

    constructor(){
        super(UserModel)
    }

    async findByEmail(email:string) : Promise <UserInterface | null> {
        return await this.findOne(email);
    }

    async createUser(userData:UserInterface) : Promise <UserInterface | null>{
        return await this.create(userData)
    }

    public async googleLogin(userData: UserInterface): Promise<UserInterface | null > {
        return await this.createUser(userData);   
    }

    public async updateProfile(email: string, profilePicture : string ): Promise< void> {
        await this.update( email , {profilePicture : profilePicture} )
    }

    public async resetPassword(email: string, password : string ): Promise<UserInterface | null> {
        return await this.update( email , {hashedPassword : password} )
    }

    public async blockUser(email: string, isBlocked : boolean ): Promise<void> {
        await this.update( email , {isBlocked : isBlocked} )
    }
   
}
