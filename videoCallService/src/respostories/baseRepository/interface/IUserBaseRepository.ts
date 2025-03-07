import { UserInterface  } from "../../../models/userModel";

export interface IUserBaseRepository{

    createUser(payload: UserInterface): Promise<void> ; 

}