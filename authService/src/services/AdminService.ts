import { AdminInterface } from "../models/adminModel";
import IAdminService from "./interfaces/IAdminService";
import IAdminRepository from "../repositories/interfaces/IAdminRespository";

export class AdminService implements IAdminService {
  private adminRepository: IAdminRepository;
  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }

  async getAdminData(email: string): Promise<AdminInterface | null> {
    return this.adminRepository.getAdminData(email)
  }
  async createAdmin(email: string, password: string): Promise<AdminInterface | null> {
    return this.adminRepository.createAdmin( email, password)
  }
}