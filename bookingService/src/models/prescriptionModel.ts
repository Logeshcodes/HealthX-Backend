import mongoose, { Document, Schema } from "mongoose";

export interface PrescriptionInterface extends Document {
    doctorId: string;
    patientId: string;
    appointmentId: string;
    prescriptionDate: Date;
    diagnosis: string;
    medications: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string;
    }[];
    notes?: string;
}

const prescriptionSchema = new Schema(
    {
        doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
        appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
        prescriptionDate: { type: Date, required: true, default: Date.now },
        diagnosis: { type: String, required: true },
        medications: [
            {
                name: { type: String, required: true },
                dosage: { type: String, required: true },
                frequency: { type: String, required: true },
                duration: { type: String, required: true },
                instructions: { type: String }
            }
        ],
        notes: { type: String },
    },
    { timestamps: true }
);

const PrescriptionModel = mongoose.model<PrescriptionInterface>("Prescription", prescriptionSchema);
export default PrescriptionModel;
