import { UserInterface } from "../../models/userModel";
import { ReportInterface } from "../../models/reportModel";
import { WalletData } from "../../types/walletType";
import { Request, Response } from "express";

export interface IUserController{

    addUser( payload : UserInterface) : Promise<void>;
    passwordReset( data:{ email : string , hashedPassword : string }): Promise<void>;
    updateWalletCancelAppointment( data: WalletData): Promise<void>;
    updateWalletBookAppointment( data: WalletData): Promise<void>;

    getUser( req : Request , res : Response) : Promise <void> ;
    updateProfile( req : Request , res : Response) : Promise <void> ;
    updatePassword( req : Request , res : Response) : Promise <void> ;
    getUsers( req : Request , res : Response) : Promise <void> ;
    findAllBanners( req : Request , res : Response) : Promise <void> ;
    findAllDoctors( req : Request , res : Response) : Promise <void> ;
    findAllHomeDoctors( req : Request , res : Response) : Promise <void> ;
    findAllDepartment( req : Request , res : Response) : Promise <void> ;
    blockUser( req : Request , res : Response) : Promise <void> ;
    getDoctorDetails( req : Request , res : Response) : Promise <void> ;
    addReport( req: Request, res: Response) : Promise<void>;
    


}