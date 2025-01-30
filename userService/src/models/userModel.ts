import mongoose, { Schema, Document} from "mongoose";

export interface UserInterface extends Document{
    
    username? : string , 
    email : string , 
    MobileNumber? : string , 
    hashedPassword : string , 
    role: string ,
    profilePicture? : string ,
    authenticationMethod : string , 
    isVerified : boolean ,
    isBlocked : boolean ,
    createdAt?: Date ,
    updateAt? : Date 
}

const UserSchema : Schema<UserInterface> = new Schema({
    username : { type : String , required : false},
    email : { type : String , required : true , unique : true },
    MobileNumber : { type : String , required : false , unique : true },
    hashedPassword : { type : String , required : true },
    role : { type : String , required : false , default : 'user' },
    profilePicture : { type : String , required : false , default : 'No Picture' },
    authenticationMethod : { type : String , required : false , default : 'Password' },
    isVerified : { type : Boolean , required : false , default : false },
    isBlocked : { type : Boolean , required : false , default : false },
},{
    timestamps : true 
})


const UserModel = mongoose.model<UserInterface>('User' , UserSchema)

export default UserModel ;