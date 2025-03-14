import { Request, Response } from "express";
import { IReviewService } from "../services/interface/IReviewService";
import { IReviewController } from "./interface/IReviewController";
import mongoose from "mongoose";
import { StatusCode } from "../utils/enum";
import { ResponseError } from "../utils/constants";

export class ReviewController implements IReviewController {
  private reviewService: IReviewService;

  constructor(reviewService: IReviewService) {
    this.reviewService = reviewService;
  }


  async createReview(req: Request, res: Response): Promise<void> {
      try {
          const { doctorId, userId, rating, comment } = req.body;

          if (!doctorId || !userId || !rating || !comment) {
              res.status(400).json({ success: false, message: "Doctor ID, User ID, rating, and comment are required",});
              return;
          }

          if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(userId)) {
              res.status(400).json({ success: false,message: "Invalid Doctor ID or User ID format"});
              return;
          }
          console.log("doctor and user" , userId , doctorId)
          const existingReview = await this.reviewService.getUserReview(doctorId , userId); 
          console.log(existingReview)
          if (existingReview) {
            res.json({ success: false, message: ResponseError.REVIEW_EXIST,});
              return;
          }
          const newReview = await this.reviewService.createReview(doctorId, userId, rating, comment);
          if (newReview) {
              res.status(201).json({ success: true,message: ResponseError.REVIEW_CREATED, data: newReview,});
          } else {
              res.status(500).json({ success: false, message: ResponseError.REVIEW_CREATION_FAILED,});
          }
      } catch (error: any) {
          res.status(500).json({ success: false, message: "Internal Server Error", error: error.message || error,});
      }
  }


  async createReply(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId, userId, comment } = req.body;
  
      if (!reviewId || !userId  || !comment.trim()) {
        res.status(400).json({ success: false, message: "All fields are required." });
        return;
      }
  
      if (!mongoose.Types.ObjectId.isValid(reviewId) || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ success: false, message: "Invalid Review ID or User ID format" });
        return;
      }
  
      const updatedReview = await this.reviewService.createReply(reviewId, userId, comment);
  
      if (updatedReview) {
        res.status(201).json({ success: true, message: "Reply added successfully", data: updatedReview });
      } else {
        res.status(500).json({ success: false, message: "Failed to add reply." });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message || error });
    }
  }
  
  

  async likeReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId, userId } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(reviewId) || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ success: false, message: "Invalid Review ID or User ID format" });
        return;
      }
  
      const updatedReview = await this.reviewService.toggleLike(reviewId, userId);
  
      res.status(200).json({ success: true, message: "Review liked/unliked successfully", data: updatedReview });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message || error });
    }
  }
  
  async likeReply(req: Request, res: Response): Promise<void> {
    try {
      const { replyId, userId, reviewId } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(replyId) || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        res.status(400).json({ success: false, message: "Invalid IDs format" });
        return;
      }
  
      const updatedReview = await this.reviewService.toggleReplyLike(reviewId, replyId, userId);
  
      res.status(200).json({ success: true, message: "Reply liked/unliked successfully", data: updatedReview });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message || error });
    }
  }
  
  

  async getDoctorReviews(req: Request, res: Response): Promise<any> {
    try {
      const { doctorId } = req.params;
 
      console.log("Doctor ID in params:", doctorId);
 
      if (!doctorId) {
        return res.status(400).json({ success: false, message: "doctorId is required in params" });
      }
 
      const reviews = await this.reviewService.getDoctorReviews(doctorId);
      const averageRating = await this.reviewService.getAverageRating(doctorId);
 
      res.status(StatusCode.OK).json({
        success: true,
        message: ResponseError.DOCTOR_REVIEWS_FETCHED,
        data: { reviews, averageRating },
      });
 
    } catch (error) {
      console.error("Error in getDoctorReviews:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
 }
 
}