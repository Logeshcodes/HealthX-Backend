
import { SlotInterface } from "../../models/slotModel";
import { AppointmentInterface } from "../../models/appointmentModel";
import { UserInterface } from "../../models/userModel";

export interface IUserRepository{

    // kafka - user from auth
    createUser(payload : UserInterface) : Promise<void> ;
    // kafka update from user
    updateProfile( email: string,data:any): Promise<UserInterface | null>;

    cancelAppointment( id : string): Promise<AppointmentInterface | null>;

    getSlotBooking(email: string, skip: number, limit: number): Promise<SlotInterface[] | null | undefined>
    getSlotDetailsById( id : string ) : Promise <SlotInterface | null | undefined>

    getAppointment(id: string): Promise<AppointmentInterface[] | null | undefined>

}