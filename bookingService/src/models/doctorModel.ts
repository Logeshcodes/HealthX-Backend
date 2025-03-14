import mongoose , {Document, Schema} from "mongoose";

export interface DoctorInterface extends Document{
    name : string , 
    email : string , 
    Mobile : number , 
    hashedPassword : string ,
    department : string ,
    gender? : string ,
    role? : string ,
    education : string ,
    experience : number ,
    description : string ,
    profilePicture? : string ,
    isBlocked? : boolean ,
    status? : string ,
    location? : string ,
    consultationType : string ,
    createdAt?: Date ,
    updateAt? : Date 
}


const doctorSchema : Schema<DoctorInterface> = new Schema({
    name : { type : String , required : true},
    email : { type : String , required : true , unique : true },
    Mobile: { type: Number, required: true, unique: true, sparse: true },
    hashedPassword : { type : String , required : true  },
    department : { type : String , required : true },
    gender : { type : String , required : false },
    role : { type : String , required : true} ,
    education : { type : String , required : true },
    experience : { type : Number , required : true},
    description : {type : String , required : true },
    profilePicture : { type : String , required : false  },
    location : { type : String , required : false  },
    isBlocked : { type : Boolean , required : true , default: false },
    status : { type : String , required : true  , default : 'pending'},
    consultationType : { type : String , required : true },
},{
    timestamps : true 
})


const DoctorModel = mongoose.model <DoctorInterface> ('Doctor' , doctorSchema) ;

export default DoctorModel ;