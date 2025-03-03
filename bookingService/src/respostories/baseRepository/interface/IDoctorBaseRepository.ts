import { SlotInterface } from "../../../models/slotModel";
import { DoctorInterface } from "../../../models/doctorModel";
import { AppointmentInterface } from "../../../models/appointmentModel";

export interface IDoctorBaseRepository{


    createDoctor(payload: DoctorInterface): Promise<DoctorInterface | null> ;
    updateProfile( email: string, profilePicture: string): Promise<  void>

    createSlot(data : object): Promise<SlotInterface | null | undefined>;

    deleteSlot(_id : string): Promise<any>;

    getSlotBooking(email: string): Promise<SlotInterface[] | null | undefined>

    getAllAppointmentDetails(id: string, skip: number, limit: number , activeTab : string): Promise<AppointmentInterface[] | null | undefined>
    getAppointment(id: string): Promise<AppointmentInterface[] | null | undefined>
   

}