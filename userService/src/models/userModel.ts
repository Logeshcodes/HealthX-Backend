import mongoose, { Schema, Document} from "mongoose";

export interface ITransaction {
    amount: number;
    type: "credit" | "debit";
    txnid:string;
    description: string;
    transactionId: string;
    date: Date;
  }

  const TransactionSchema: Schema<ITransaction> = new Schema({
    amount: { type: Number, required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    description: { type: String, required: true },
    transactionId: { type: String, required: true },
    date: { type: Date, default: Date.now },
  });

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
    wallet: {
        balance: number;
        transactions: ITransaction[];
      };
    age? : number ,
    gender? : string ,
    height? : number ,
    weight? : number ,
    bloodGroup? : string ,
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
    wallet: {
        balance: { type: Number, required: true, default: 0 },
        transactions: [TransactionSchema],
      },
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