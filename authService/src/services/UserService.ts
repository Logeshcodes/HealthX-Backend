import IUserRepository from "../repositories/interfaces/IUserRepository";
import { UserInterface } from "../models/userModel";
import IUserServices from "./interfaces/IUserServices";

class UserServices implements IUserServices {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserServices) {
    this.userRepository = userRepository;
  }

  public async findByEmail(email: string) : Promise<UserInterface | null>{
    return await this.userRepository.findByEmail(email);
  }

  public async createUser(userData: UserInterface) {
    return await this.userRepository.createUser(userData);
  }

  public async googleLogin(userData: UserInterface): Promise<UserInterface | null> {
      return await this.userRepository.googleLogin(userData );
  }

  public async resetPassword(email: string, password: string) : Promise<UserInterface | null> {
    return await this.userRepository.resetPassword(email, password); 
  }

  public async updateProfile(email: string,profilePicture: string): Promise<void> {
    await this.userRepository.updateProfile(email,profilePicture);
  }

  public async blockUser(email: string,isBlocked: boolean): Promise<void>{
    await this.userRepository.blockUser(email, isBlocked); 
  }
}

export default UserServices;
