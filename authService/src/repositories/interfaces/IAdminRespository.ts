import { AdminInterface } from "@/models/adminModel";
import { IGenericRepository } from "../GenericRepository.ts/GenericRepository";

export default interface IAdminRepository extends IGenericRepository<AdminInterface> {
    createAdmin(email: string, password: string): Promise<AdminInterface | null>;
    getAdminData(email: string): Promise<AdminInterface | null>;
}