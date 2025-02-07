import { Document, Model } from "mongoose";
import DoctorModel , {DoctorInterface} from "../../models/doctorModel"

export class DoctorBaseRepository<T extends Document> {
  private model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  async createDoctor(payload: DoctorInterface): Promise<DoctorInterface | null> {
    try {
      const doctor = await DoctorModel.create(payload);
      await doctor.save();
      return doctor;
    } catch (error) {
      throw error;
    }
  }

  async getDoctorData(email: string): Promise<DoctorInterface | null> {
    try {
      const doctorData = await DoctorModel.findOne({ email: email });
      return doctorData;
    } catch (error) {
      throw error;
    }
  }

  // Doctor - Profile - update
  async updateProfile(email:string, data: object): Promise<DoctorInterface | null> {
    try {
      const doctorData = await DoctorModel.findOneAndUpdate( 
        {email : email},
        {$set : data},
        {new: true});
      return doctorData;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(email: string, password: string): Promise<DoctorInterface | null> {
    try {
      const doctorData = await DoctorModel.findOneAndUpdate(
        { email },
        {
          $set: {
            hashedPassword: password,
          },
        },
        { new: true }
      );
      return doctorData;
    } catch (error) {
      throw error;
    }
  }

  async getDoctors(){
    try {
        const response=await DoctorModel.find()
        return response
        
    } catch (error) {
        console.log(error);
        
    }
  }
}