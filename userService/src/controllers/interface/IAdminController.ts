import { Request, Response } from "express";
import { WalletData } from "../../types/walletType";
import { AdminInterface } from "../../models/adminModel";

export interface IAdminController{

    addAdmin(payload : AdminInterface): Promise<void>;
    updateWalletBookAppointment( data: WalletData): Promise<void>;

    createDepartment(req : Request , res : Response) : Promise<void> ;
    getAllDepartments(req : Request , res : Response) : Promise<void> ;
    getAllUsers(req : Request , res : Response) : Promise<void> ;
    getAllDoctors(req : Request , res : Response) : Promise<void> ;
    getAdminData(req : Request , res : Response) : Promise<void> ;
    blockUser(req : Request , res : Response) : Promise<void> ;
    listBanner(req : Request , res : Response) : Promise<void> ;
    blockDoctor(req : Request , res : Response) : Promise<void> ;
    rejectDocuments(req : Request , res : Response) : Promise<void> ;
    approveDocuments(req : Request , res : Response) : Promise<void> ;

    getDepartmentByName(req: Request, res: Response): Promise<void>;
    updateDepartment(req: Request, res: Response): Promise<void>;
    getBannerById(req: Request, res: Response): Promise<void>;
    updateBanner(req: Request, res: Response): Promise<void>;
    getDoctorByEmail(req: Request, res: Response): Promise<void>;

    addBanner( req : Request , res : Response) : Promise <void> ;
       
    getAllBanner (req : Request , res : Response) : Promise<void> ;
    getAllReport (req : Request , res : Response) : Promise<void> ;
}