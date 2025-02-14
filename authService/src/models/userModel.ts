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
    updateAt? : Date ,

    age? : number ,
    gender? : string ,
    height? : number ,
    weight? : number ,
    bloodGroup? : string ,
}

const UserSchema : Schema<UserInterface> = new Schema({
    username : { type : String , required : false},
    email : { type : String , required : true , unique : true },
    MobileNumber : { type : String , required : false , unique : true },
    hashedPassword : { type : String , required : true },
    role : { type : String , required : false , default : 'User' },
    profilePicture : { type : String , required : false , default : 'No Picture' },
    authenticationMethod : { type : String , required : false , default : 'Password' },
    isVerified : { type : Boolean , required : true , default : false },
    isBlocked : { type : Boolean , required : true , default : false },

    age : { type : Number , required : false  },
    gender : { type : String , required : false  },
    height : { type : Number , required : false  },
    weight : { type : Number , required : false  },
    bloodGroup : { type : String , required : false  },

},{
    timestamps : true 
})


const UserModel = mongoose.model<UserInterface>('User' , UserSchema)

export default UserModel ;