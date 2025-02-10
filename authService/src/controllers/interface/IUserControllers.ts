
import { UserInterface } from "../../models/userModel";
import { Request, Response } from "express";

export default interface IUserControllers {
    userSignUp(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    createUser(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    verifyEmail(req: Request, res: Response):Promise<void>;
    verifyResetOtp(req: Request, res: Response):Promise<void>;
    forgotResendOtp(req: Request, res: Response):Promise<void>;
    resetPassword(req: Request, res: Response):Promise<void>;

    doGoogleLogin(req: Request, res: Response):Promise<void>;

    // below not implements - Google & Kafka Consume

    updatePassword(data:{ email: string; password: string }): Promise<UserInterface | null | undefined>;
    updateProfile(data:{ email: string; data :object }): Promise<void>;
    blockUser(data:{email:string,isBlocked:string}): Promise<void>;
  
}