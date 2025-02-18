import SlotModel , { SlotInterface } from "../models/slotModel";
import { IUserController } from "./interface/IUserController";

import { Request, Response } from "express";

import { IUserService } from "../services/interface/IUserService"; 



export class UserController implements IUserController {

    private userService: IUserService;
    constructor(userService :IUserService) {
      this.userService = userService ;
    }


    public async getSlotBooking(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            const { page = 1, limit = 4 } = req.query; 
            
            console.log(`Fetching slots for email: ${email} - Page: ${page}, Limit: ${limit}`);
    
            // Ensure page and limit are numbers
            const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
            const limitNum = Math.max(parseInt(limit as string, 10) || 4, 1);

    
            // Calculate the skip and limit
            const skip = (pageNum - 1) * limitNum;
    
            const response = await this.userService.getSlotBooking(email, skip, limitNum);
            // console.log(response);
    
            if (response) {
                const totalSlots = await SlotModel.countDocuments({ email: email }); 

                console.log("ans" ,response ,totalSlots , pageNum  )
                
                res.json({
                    success: true,
                    message: "Slots fetched successfully",
                    data: response,
                    total: totalSlots,  
                    page: pageNum,
                    totalPages: Math.ceil(totalSlots / limitNum), 
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "No slots found!",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
    

    public async getSlotDetailsById(req: Request, res: Response): Promise < void >{

       try {
        
        const { id } = req.params;

        console.log(" slot id" , id)

        const response = await this.userService.getSlotDetailsById( id); 


        if (response) {
            
            res.json({
                success: true,
                message: "Slots fetched successfully",
                data: response,
                
            });
            return ;
        } else {
            res.status(404).json({
                success: false,
                message: "No slots found!",
            });
        }


       } catch (error) {

            console.error("Error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
       }

    }
      

}