import { Request, Response } from "express";
import { DepartmentInterface } from "../../models/departmentModel";
import { DoctorInterface } from "@/models/doctorModel";

export interface IAdminController{

    createDepartment(req : Request , res : Response) : Promise<void> ;
    getAllDepartments(req : Request , res : Response) : Promise<void> ;
    getAllUsers(req : Request , res : Response) : Promise<void> ;
    getAllDoctors(req : Request , res : Response) : Promise<void> ;
    blockUser(req : Request , res : Response) : Promise<void> ;
    blockDoctor(req : Request , res : Response) : Promise<void> ;
    rejectDocuments(req : Request , res : Response) : Promise<void> ;
    approveDocuments(req : Request , res : Response) : Promise<void> ;

    getDepartmentByName(req: Request, res: Response): Promise<void>;
    updateDepartment(req: Request, res: Response): Promise<void>;
    getDoctorByEmail(req: Request, res: Response): Promise<void>;
       
    
}