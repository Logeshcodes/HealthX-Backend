import AdminModel, { AdminInterface } from "../models/adminModel";
import { GenericRespository } from "./GenericRepository.ts/GenericRepository";
import IAdminRepository from "./interfaces/IAdminRespository";

export class AdminRepository extends GenericRespository<AdminInterface>implements IAdminRepository
{
  constructor() {
    super(AdminModel);
  }

  async createAdmin(email: string, password: string) {
    const payload = {email , password};
    return await this.create(payload);
  }

  async getAdminData(email: string) {
    return await this.findOne(email);
  }
}
