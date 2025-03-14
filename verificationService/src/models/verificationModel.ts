import mongoose, { Schema, Document, model, } from "mongoose";

export interface IVerificationModel extends Document{
    name:string,
    email: string,
    medicalLicenseUrl: string, 
    degreeCertificateUrl: string, 
    status: string,
    reviewedAt: Date,
}


const verificationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    medicalLicenseUrl: { type: String, required: true }, 
    degreeCertificateUrl: { type: String, required: true }, 
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const VerificationModel=mongoose.model<IVerificationModel>('VerificationRequests',verificationRequestSchema)

export default VerificationModel