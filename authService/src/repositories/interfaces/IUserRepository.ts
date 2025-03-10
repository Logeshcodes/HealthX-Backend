import { UserInterface } from "../../models/userModel";

export default interface IUserRepository {
    findByEmail(email:string): Promise<UserInterface | null>;
    createUser(userData: UserInterface): Promise<UserInterface | null>;
    updateProfile( email: string, profilePicture : string ): Promise< void>;
    blockUser(email:string,isBlocked:boolean): Promise<void> ;
    resetPassword(email:string,password:string): Promise<UserInterface | null> ;
    googleLogin(userData: UserInterface): Promise<UserInterface | null >;
}