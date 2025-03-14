import { IReviewService } from "./interface/IReviewService";
import { IReviewRepository } from "../respostories/interface/IReviewRespository";
import {IReview, ReviewModel } from "../models/reviewModel";
import DoctorModel from "../models/doctorModel";
import { Types } from "mongoose";

import { ResponseError } from "../utils/constants";
import UserModel from "../models/userModel";

export class ReviewService implements IReviewService {
  private reviewRepository: IReviewRepository;

  constructor(reviewRepository: IReviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async createReview(doctorId: string,userId: string, rating: number, comment?: string): Promise<IReview> {
    try {
      const doctortorExists = await DoctorModel.findById(doctorId);
      if (!doctortorExists) {
        console.log("doctor not found...")
        throw new Error(ResponseError.NOT_FOUND);
      }
      const response = await this.reviewRepository.create({ doctorId: new Types.ObjectId(doctorId), userId: new Types.ObjectId(userId),
        rating,
        comment: comment || "", 
      });
      
      const avgRating = await this.reviewRepository.getAverageRating(doctorId);
      await DoctorModel.findByIdAndUpdate(doctorId, {$set: {rating: avgRating}});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async createReply(reviewId: string, userId: string, comment: string): Promise<any> {
    try {
      // Fetch the user details to store username and profilePicture
      const user = await UserModel.findById(userId).select("username profilePicture");
      if (!user) {
        throw new Error("User not found");
      }
  
      // Check if the review exists
      const reviewExists = await ReviewModel.findById(reviewId);
      if (!reviewExists) {
        throw new Error("Review not found");
      }
  
      // Construct the reply object with user details
      const reply = {
        userId: new Types.ObjectId(userId),
        userName: user.username,
        userProfilePicture: user.profilePicture,
        comment,
        likedBy: [],
        createdAt: new Date(),
      };
  
      // Push the reply into the review's replies array
      const updatedReview = await ReviewModel.findByIdAndUpdate(
        reviewId,
        { $push: { replies: reply } },
        { new: true }
      );
  
      return updatedReview; // Return the new reply
    } catch (error) {
      throw error;
    }
  }
  
  

  async toggleLike(reviewId: string, userId: string): Promise<IReview | null> {
    try {
      const review = await ReviewModel.findById(reviewId);
      if (!review) {
        throw new Error("Review not found");
      }
  
      const userIndex = review.likedBy.findIndex((id : any) => id.toString() === userId);
      
      if (userIndex === -1) {
        review.likedBy.push(new Types.ObjectId(userId)); 
      } else {
        review.likedBy.splice(userIndex, 1);
      }
  
      await review.save();
      return review;
    } catch (error) {
      throw error;
    }
  }

  async toggleReplyLike(reviewId: string, replyId: string, userId: string): Promise<IReview | null> {
    try {
      const review = await ReviewModel.findById(reviewId);
      if (!review) {
        throw new Error("Review not found");
      }
  
     
      const reply = review.replies.find((r: any) => r._id.toString() === replyId);
      if (!reply) {
        throw new Error("Reply not found");
      }

      console.log("reply const " ,reply)
  
      // Check if user has already liked the reply
      const userIndex = reply.likedBy.findIndex((id: any) => id.toString() === userId);

      console.log("userindex const " ,userIndex)
  
      if (userIndex === -1) {
        reply.likedBy.push(new Types.ObjectId(userId)); // Add like
      } else {
        reply.likedBy.splice(userIndex, 1); // Remove like
      }
  
      await review.save();
      return review;
    } catch (error) {
      throw error;
    }
  }
  
  
  
  

  async getDoctorReviews(doctorId: string): Promise<IReview[]> {
    try {
      return await this.reviewRepository.getDoctorReviews(doctorId);
    } catch (error) {
      throw error;
    }
  }

  async getUserReview(doctorId: string , userId : string): Promise<IReview | null> {
    try {
      return await this.reviewRepository.getUserReview(doctorId, userId);
    } catch (error) {
      throw error;
    }
  }

  async getAverageRating(doctorId: string): Promise<number> {
    try {
      return await this.reviewRepository.getAverageRating(doctorId);
    } catch (error) {
      throw error;
    }
  }
}