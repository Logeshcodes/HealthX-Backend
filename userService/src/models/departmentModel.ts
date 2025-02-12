import mongoose, { Schema, Document } from "mongoose";

export interface DepartmentInterface extends Document {
  departmentName: string;
  isListed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const DepartmentSchema: Schema<DepartmentInterface> = new Schema(
  {
    departmentName: { type: String, required: true },
    isListed: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true, 
  }
);

const DepartmentModel = mongoose.model<DepartmentInterface>('Department', DepartmentSchema);

export default DepartmentModel;
