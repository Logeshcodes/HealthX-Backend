import mongoose, { Schema, Document, model, } from "mongoose";

export interface IVerificationModel extends Document{
    name:string,
    email: string,
    department: string,
    education: string,
    medicalLicenseUrl: string, 
    degreeCertificateUrl: string, 
    status: string,
    reviewedAt: Date,
    rejectedReason: string,
}


const verificationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    education: { type: String, required: true },
    medicalLicenseUrl: { type: String, required: true }, 
    degreeCertificateUrl: { type: String, required: true }, 
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewedAt: { type: Date, default: Date.now },
    rejectedReason: { type: String, required: false },
  },
  { timestamps: true }
);

const VerificationModel=mongoose.model<IVerificationModel>('VerificationRequests',verificationRequestSchema)

export default VerificationModel