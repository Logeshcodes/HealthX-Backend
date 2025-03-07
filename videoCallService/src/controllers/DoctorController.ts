import { IDoctorController } from "./interface/IDoctorController";
import { IDoctorService } from "../services/interface/IDocterService";

import { DoctorInterface } from "../models/doctorModel";

export class DoctorController implements IDoctorController {

  private doctorService: IDoctorService;
  constructor(doctorService :IDoctorService) {
    this.doctorService = doctorService
  }

  public async addDoctor(payload: DoctorInterface): Promise<void> {
    try {
      let response = await this.doctorService.createDoctor(payload);
    } catch (error) {
      console.log(error);
    }
  }
}