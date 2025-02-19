import { Request, Response } from "express";

import { SlotInterface } from "../../models/slotModel";

export interface IUserController {

   
    getSlotBooking(req: Request, res: Response): Promise<void>;
    getSlotDetailsById(req: Request, res: Response): Promise < void >;
    updateSlot( payload : SlotInterface ) : Promise <void>;
}