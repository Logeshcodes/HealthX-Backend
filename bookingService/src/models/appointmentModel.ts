import mongoose, { Schema, Document, Types } from "mongoose";

export interface AppointmentInterface extends Document {
  slotId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  paymentId: string;
  amount: number;
  status: string;
  paymentStatus: string;
  appointmentDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AppointmentSchema: Schema<AppointmentInterface> = new Schema(
  {
    slotId: { type: Schema.Types.ObjectId, required: true },
    patientId: { type: Schema.Types.ObjectId, required: true },
    doctorId: { type: Schema.Types.ObjectId, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, default: "booked" },
    paymentStatus: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const AppointmentModel = mongoose.model<AppointmentInterface>("Appointment", AppointmentSchema);

export default AppointmentModel;
