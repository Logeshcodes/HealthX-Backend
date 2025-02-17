
import { SlotInterface } from "../../models/slotModel";

import { Request, Response } from "express";


export interface IDoctorRepository{

    createSlot( data : object) : Promise<SlotInterface | null | undefined> ;
    getSlotBooking(email: string): Promise<SlotInterface[] | null | undefined>
    deleteSlot(_id: string): Promise<SlotInterface | null | undefined>
   

}