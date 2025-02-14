

import { UserInterface } from "../../models/userModel";
import { Request, Response } from "express";

export default interface IUserServices {
    findByEmail(email:string): Promise<UserInterface | null>;
    createUser(userData:any): Promise<UserInterface | null>;
    resetPassword(email:string,password:string): Promise<UserInterface | null>;
    updateProfile( email: string,data:any): Promise<UserInterface | null>;
    blockUser(email:string,isBlocked:boolean): Promise<UserInterface | null>
    googleLogin(name: string, email: string, password: string , profilePicture : string): Promise<UserInterface | null>;
   
}