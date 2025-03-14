import mongoose , {Document, Mongoose, Schema} from "mongoose";

export interface SlotInterface extends Document {
    name : string ,
    email : string ,
    date : Date ,
    day : string ,
    timeSlot : string ,
    mode : string ,
    avaliable : boolean ,
}

const slotBookingSchema = new mongoose.Schema(
    {
        name : {type : String , required : true},
        email : {type : String , required : true } ,
        date : { type: Date, required: true },
        day : {type : String , required : true} ,
        timeSlot :  {type : String , required : true} ,
        mode :  {type : String , required : true} ,
        avaliable :  {type : Boolean , required : true , default : true } ,
    },
    { timestamps: true }
)

const SlotModel=mongoose.model<SlotInterface>('timeSlots',slotBookingSchema)
export default SlotModel