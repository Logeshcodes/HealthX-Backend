import { Request, Response } from "express";

import { SlotInterface } from "../../models/slotModel";

export interface IUserController {

   
    getSlotBooking(req: Request, res: Response): Promise<void>;
 
}