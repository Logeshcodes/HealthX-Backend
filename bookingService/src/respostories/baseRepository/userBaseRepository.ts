import { IUserBaseRepository } from "./interface/IUserBaseRepository";
import SlotModel , {SlotInterface} from "../../models/slotModel";

export default class UserBaseRepository implements IUserBaseRepository {


    public async getSlotBooking(email: string, skip: number, limit: number): Promise<SlotInterface[] | null | undefined> {
        try {
            const response = await SlotModel.find({ email })
                .skip(skip)  
                .limit(limit)  
                .exec();
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    


}