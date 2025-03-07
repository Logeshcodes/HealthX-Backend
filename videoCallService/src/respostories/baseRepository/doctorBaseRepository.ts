import DoctorModel , {DoctorInterface} from "../../models/doctorModel"

import { IDoctorBaseRepository } from "./interface/IDoctorBaseRepository";



export class DoctorBaseRepository implements IDoctorBaseRepository {


  async createDoctor(payload: DoctorInterface): Promise<DoctorInterface | null> {
    try {

      console.log("Kafka payload___________***" , payload)
      const doctor = await DoctorModel.create(payload);
      await doctor.save();
      return doctor;
    } catch (error) {
      throw error;
    }
  }
}