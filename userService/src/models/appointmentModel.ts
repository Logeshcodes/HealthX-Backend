import mongoose, { Schema, Document } from "mongoose";

export interface AppointmentInterface extends Document {
  doctorEmail: string;
  patientEmail: string;
  paymentId: string;
  amount: number;
  mode : string ,
  paymentStatus: string;
  appointmentDate: Date;
  appointmentDay: string;
  appointmentTime: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AppointmentSchema: Schema<AppointmentInterface> = new Schema(
  {
    doctorEmail: { type: String, required: true },
    patientEmail: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    mode: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentDay: { type: String, required: true },
    appointmentTime: { type: String, required: true },
 
  },
  {
    timestamps: true,
  }
);

const AppointmentModel = mongoose.model<AppointmentInterface>("Appointment", AppointmentSchema);

export default AppointmentModel;
