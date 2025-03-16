import { SlotInterface } from "../../models/slotModel"
import { DoctorInterface } from "../../models/doctorModel";
import { AppointmentInterface } from "../../models/appointmentModel";

export interface IAdminService {

   
    getAllAppointmentDetails( skip: number, limit: number , activeTab : string): Promise<AppointmentInterface[] | null | undefined>

}