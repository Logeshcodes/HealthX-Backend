import { SlotInterface } from "../../models/slotModel"
import { DoctorInterface } from "../../models/doctorModel";
import { AppointmentInterface } from "../../models/appointmentModel";

export interface IDoctorService {

    // kafka from auth
    createDoctor( payload : DoctorInterface) : Promise <void> ;
    updateProfile(email: string, profilePicture: string , location : string): Promise<void>

    createSlot( data : object): Promise<SlotInterface | null | undefined> ;
    getSlotBooking(email: string): Promise<SlotInterface[] | null | undefined>
    deleteSlot(_id: string ): Promise<SlotInterface  | null | undefined>
    getAllAppointmentDetails(id: string, skip: number, limit: number , activeTab : string): Promise<AppointmentInterface[] | null | undefined>

}