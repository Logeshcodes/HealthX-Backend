import { Request, Response } from "express";

import { SlotInterface } from "../../models/slotModel";

export interface IDoctorController {

    slotBooking(req: Request, res: Response ) : Promise <any> ;
    deleteSlot(req: Request, res: Response ) : Promise <any> ;
    getSlotBooking(req: Request, res: Response): Promise<void>;
 
}