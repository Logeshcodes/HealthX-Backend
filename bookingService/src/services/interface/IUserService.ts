import { SlotInterface } from "../../models/slotModel"

export interface IUserService {

   
    getSlotBooking(email: string, skip: number, limit: number): Promise<SlotInterface[] | null | undefined>

    getSlotDetailsById( id : string ) : Promise <SlotInterface | null | undefined>
}