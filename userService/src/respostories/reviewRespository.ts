import { GenericRespository } from "./GenericRepository.ts/GenericRepository"
import { ReviewModel , IReview } from "../models/reviewModel";
import { IReviewRepository } from "./interface/IReviewRespository";
import mongoose from "mongoose";

export class ReviewRepository extends GenericRespository<IReview>implements IReviewRepository{

  constructor() {
    super(ReviewModel);
  }

  async getDoctorReviews(doctorId: string): Promise<IReview[]> {
    try {
        return await ReviewModel.find({ doctorId })
        .populate("userId", "username email profilePicture")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  async getUserReview(doctorId: string,userId: string): Promise<IReview | null> {
    try {
      return await ReviewModel.findOne({ doctorId : doctorId , userId: userId });
    } catch (error) {
      throw error;
    }
  }

  async getAverageRating(doctorId: string): Promise<number> {
    try {
      const result = await ReviewModel.aggregate([
        {
          $match: {
            doctorId: new mongoose.Types.ObjectId(doctorId),
          },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      return result[0]?.averageRating || 0;
    } catch (error) {
      throw error;
    }
  }
}