import { IGenericRepository } from "../GenericRepository.ts/GenericRepository";
import { IReview } from "../../models/reviewModel";

export interface IReviewRepository extends IGenericRepository<IReview> {
        getDoctorReviews(doctorId: string): Promise<IReview[]>;
        getUserReview(doctorId: string,userId: string): Promise<IReview | null>;
        getAverageRating(doctorId: string): Promise<number>;
}