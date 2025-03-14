import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document {
  doctorId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  likedBy: Types.ObjectId[];
  replies: Array<{
      userId: Types.ObjectId;
      userName: string;
      userProfilePicture: string;
      comment: string;
      likedBy : Types.ObjectId[];
      createdAt: Date;
    }>;
}

const replySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userProfilePicture: { type: String, required: true },
  comment: { type: String, required: true },
  likedBy: [{type: Schema.Types.ObjectId}],
  createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new Schema<IReview>({

    doctorId: {type: Schema.Types.ObjectId,required: true,ref: "Doctor"},
    userId: {type: Schema.Types.ObjectId,required: true,ref: "User"},
    rating: {type: Number,required: true,min: 1,max: 5},
    comment: {type: String,trim: true},
    likedBy: [{type: Schema.Types.ObjectId,  ref: 'User' }],
    replies: [replySchema]
},
{ timestamps: true });

export const ReviewModel = model<IReview>("Review", ReviewSchema);