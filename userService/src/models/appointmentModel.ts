import mongoose, { Schema, Document } from "mongoose";

export interface AppointmentInterface extends Document {
  slotId : string ,
  doctorName : string ,
  profilePicture : string ,
  doctorEmail: string;
  patientEmail: string;
  paymentId: string;
  amount: number;
  mode : string ,
  status : string ,
  department : string ,
  location : string ,
  paymentStatus: string;
  appointmentDate: Date;
  appointmentDay: string;
  appointmentTime: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AppointmentSchema: Schema<AppointmentInterface> = new Schema(
  {
    slotId: { type: String, required: true },
    doctorName: { type: String, required: true },
    profilePicture: { type: String, required: false },
    doctorEmail: { type: String, required: true },
    patientEmail: { type: String, required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    mode: { type: String, required: true },
    status: { type: String, required: true , default : "Booked" },
    department: { type: String, required: true },
    location: { type: String, required: false },
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
