import { UserInterface } from "../../models/userModel";

export interface IUserRepository{

    createUser(payload : UserInterface) : Promise<void> ;
    

}