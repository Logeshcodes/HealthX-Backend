import mongoose, { Schema, Document, model, } from "mongoose";

export interface IVerificationModel extends Document{
    name:string,
    email: string,
    doctorLicenseUrl: string, 
    experienceCertificateUrl: string, 
    status: string,
    reviewedAt: Date,
    rejectedReason: string,
}


const verificationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    doctorLicenseUrl: { type: String, required: true }, 
    experienceCertificateUrl: { type: String, required: true }, 
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedAt: { type: Date, default: Date.now },
    rejectedReason: { type: String },
  },
  { timestamps: true }
);

const VerificationModel=mongoose.model<IVerificationModel>('VerificationRequests',verificationRequestSchema)

export default VerificationModel