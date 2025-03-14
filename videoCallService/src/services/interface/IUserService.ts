import { UserInterface } from "../../models/userModel";

export interface IUserService{
    createUser( payload : UserInterface) : Promise<void>;
}