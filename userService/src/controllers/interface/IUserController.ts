import { UserInterface } from "../../models/userModel";


import { Request, Response } from "express";

export interface IUserController{

    addUser( payload : UserInterface) : Promise<void>;
    getUser( req : Request , res : Response) : Promise <void> ;
    updateProfile( req : Request , res : Response) : Promise <void> ;
    updatePassword( req : Request , res : Response) : Promise <void> ;
    getUsers( req : Request , res : Response) : Promise <void> ;
    findAllBanners( req : Request , res : Response) : Promise <void> ;
    findAllDoctors( req : Request , res : Response) : Promise <void> ;
    findAllDepartment( req : Request , res : Response) : Promise <void> ;
    blockUser( req : Request , res : Response) : Promise <void> ;
    passwordReset( data:any): Promise<UserInterface | undefined | null>;
    updateWallet( data:{userId : string ,appointmentId : string ,transactionId : string ,  amount : number , type : string}): Promise<UserInterface | undefined | null>;


    getDoctorDetails( req : Request , res : Response) : Promise <void> ;
    


}