import { UserInterface } from "../models/userModel";
import { IUserController } from "./interface/IUserController";
import { IUserService } from "../services/interface/IUserService";

export default class UserController implements IUserController  {

    private userService: IUserService;
    constructor(userService:IUserService) {
      this.userService = userService;
    }
  
    public async addUser(payload: UserInterface): Promise<void> {
        await this.userService.createUser(payload);
    }
}