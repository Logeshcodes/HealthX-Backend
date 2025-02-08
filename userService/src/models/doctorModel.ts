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
    medicalLicense? : string , 
    experienceCertificate? : string , 
    degreeCertificate? : string , 
    isVerified? : boolean ,
    isBlocked? : boolean ,
    isApproved? : boolean ,
    status? : string ,
    rejectedReason? : string ,
    consultationType : string ,
    consultationFee? : string ,
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
    medicalLicense : { type : String , required : true , default : 'No Picture' },
    experienceCertificate : { type : String , required : true , default : 'No Picture' },
    degreeCertificate : { type : String , required : true , default : 'No Picture' },
    isVerified : { type : Boolean , required : true , default: false },
    isBlocked : { type : Boolean , required : true , default: false },
    isApproved : { type : Boolean , required : true , default: false },
    status : { type : String , required : true  , default : 'requested'},
    rejectedReason : { type : String , required : false },
    consultationType : { type : String , required : true },
    consultationFee : { type : String , required : false },
},{
    timestamps : true 
})


const DoctorModel = mongoose.model <DoctorInterface> ('Doctor' , doctorSchema) ;

export default DoctorModel ;