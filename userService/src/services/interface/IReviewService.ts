import { IReview } from "../../models/reviewModel";

export interface IReviewService {
  createReview(doctorId: string,userId: string,rating: number,comment?: string): Promise<IReview>;
  createReply(reviewId: string,userId: string,comment?: string): Promise<IReview>;
  toggleLike(reviewId: string , userId: string): Promise<IReview | null> 
  toggleReplyLike(reviewId: string ,replyId: string, userId: string): Promise<IReview | null> 
  getUserReview(doctorId: string,userId: string): Promise<IReview | null>;
  getDoctorReviews(doctorId: string): Promise<IReview[]>;
  getAverageRating(doctorId: string): Promise<number>;
}