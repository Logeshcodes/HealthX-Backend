import { AdminInterface } from "../../models/adminModel";

export default interface IAdminService {
  getAdminData(email: string): Promise<AdminInterface | null>;
  createAdmin(email: string, password: string): Promise<AdminInterface | null>;
}