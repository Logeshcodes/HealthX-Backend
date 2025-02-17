import { SlotInterface } from "../../../models/slotModel";

export interface IDoctorBaseRepository{

    createSlot(data : object): Promise<SlotInterface | null | undefined>;

    deleteSlot(_id : string): Promise<any>;

    getSlotBooking(email: string): Promise<SlotInterface[] | null | undefined>
   

}