import {  Request, Response } from "express";

export interface IReviewController {
  createReview(req: Request, res: Response): Promise<void>;
  createReply(req: Request, res: Response): Promise<void>;
  likeReview(req: Request, res: Response): Promise<void>;
  likeReply(req: Request, res: Response): Promise<void>;
  getDoctorReviews(req: Request,res: Response): Promise<void>;
}