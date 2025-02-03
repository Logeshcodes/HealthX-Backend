
import { Request, Response } from "express";

export interface IVerificationControllers {
  submitRequest(req: Request, res: Response): Promise<void>;
//   reVerifyRequest(req: Request, res: Response): Promise<void>;
  getRequestData(req: Request, res: Response): Promise<void>;
  getAllRequests(req: Request, res: Response): Promise<void>;
  approveRequest(req: Request, res: Response): Promise<void>;
}