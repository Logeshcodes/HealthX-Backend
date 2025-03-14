import mongoose, { Document, Schema } from "mongoose";

export interface ReviewInterface extends Document {
  doctorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userProfilePicture: string;
  rating: number;
  comment: string;
  likes: number;
  replies: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    userProfilePicture: string;
    comment: string;
    createdAt: Date;
  }>;

}

const replySchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userProfilePicture: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userProfilePicture: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [replySchema]
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model<ReviewInterface>('Review', reviewSchema);

export default ReviewModel;