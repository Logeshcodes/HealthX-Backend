import mongoose, { Document, Schema } from "mongoose";

export interface ReportInterface extends Document {
    doctorId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    reportType: string;
    description: string;
}

const reportSchema = new Schema(
    {
        doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reportType: { type: String, required: true },
        description: { type: String, required: true },
    },
    { timestamps: true }
);

const ReportModel = mongoose.model<ReportInterface>("Report", reportSchema);

export default ReportModel;
