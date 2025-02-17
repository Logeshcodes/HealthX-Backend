import { SlotInterface } from "../../models/slotModel"

export interface IDoctorService {

    createSlot( data : object): Promise<SlotInterface | null | undefined> ;
    getSlotBooking(email: string): Promise<SlotInterface[] | null | undefined>
    deleteSlot(_id: string ): Promise<SlotInterface  | null | undefined>
}