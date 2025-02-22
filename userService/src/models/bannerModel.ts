import mongoose, { Schema, Document } from "mongoose";

export interface BannerInterface extends Document {
  bannerTitle: string;
  description: string;
  startDate: Date;
  endDate: Date;
  link: string;
  role: "Patient" | "Doctor";
  bannerImage: string; 
  isListed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const BannerSchema: Schema<BannerInterface> = new Schema(
  {
    bannerTitle: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    link: { type: String, required: true },
    role: { type: String, required: true, enum: ["Patient", "Doctor"] },
    bannerImage: { type: String, required: true },
    isListed: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true, 
  }
);

const BannerModel = mongoose.model<BannerInterface>('Banner', BannerSchema);

export default BannerModel;
