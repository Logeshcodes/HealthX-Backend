import mongoose, { Schema, Document} from "mongoose";

export interface UserInterface extends Document{
    
    username? : string , 
    email : string , 
    mobileNumber? : number , 
    hashedPassword : string , 
    role: string ,
    profilePicture? : string ,
    authenticationMethod : string , 
    isBlocked : boolean ,
    createdAt?: Date ,
    updatedAt? : Date ,

}

const UserSchema : Schema<UserInterface> = new Schema({
    username : { type : String , required : false},
    email : { type : String , required : true , unique : true },
    mobileNumber : { type : Number , required : false , unique : true },
    hashedPassword : { type : String , required : true },
    role : { type : String , required : false , default : 'User' },
    profilePicture : { type : String , required : false  },
    authenticationMethod : { type : String , required : false , default : 'Password' },
    isBlocked : { type : Boolean , required : true , default : false },

},{
    timestamps : true 
})


const UserModel = mongoose.model<UserInterface>('User' , UserSchema)

export default UserModel ;