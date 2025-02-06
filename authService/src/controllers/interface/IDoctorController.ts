
import DoctorModel from "@/models/doctorModel";
import { Request, Response } from "express";

export default interface IDoctorControllers {
    doctorSignUp(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    createUser(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    verifyEmail(req: Request, res: Response): Promise<void>;
    verifyResetOtp(req: Request, res: Response): Promise<void>;
    forgotResendOtp(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    getAllDepartments(req: Request, res: Response): Promise<void>;

    
    updatePassword(data: { email: string; password: string }): Promise<void>;

    doGoogleLogin(req: Request, res: Response): Promise<void>;
   
}