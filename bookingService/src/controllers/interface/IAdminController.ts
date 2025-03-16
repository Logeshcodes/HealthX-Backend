import { Request, Response } from "express";


export interface IAdminController {
 
    totalAppointmentDetails(req: Request, res: Response): Promise<void>  
    generateRevenueData(req: Request, res: Response): Promise<void>  

}