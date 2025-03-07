import UserModel , { UserInterface } from "../../models/userModel";
import { IUserBaseRepository } from "./interface/IUserBaseRepository";

export default class UserBaseRepository implements IUserBaseRepository {

        async createUser(payload: UserInterface): Promise<any> {
            
          try {
            const user = await UserModel.create(payload);
            console.log('User created or updated:', user);
            
            return user;
          } catch (error) {
            console.error('Error creating user:', error);
            throw error;
          }
        }
    }