import { UserInterface } from "../../models/userModel";

export interface IUserController{
    addUser( payload : UserInterface) : Promise<void>;
}