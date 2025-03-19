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

export interface AdminInterface extends Document{
    
    username? : string , 
    email : string , 
    wallet: {
        balance: number;
        transactions: ITransaction[];
      };
}

const AdminSchema : Schema<AdminInterface> = new Schema({
    username : { type : String , required : false , default:"Admin"},
    email : { type : String , required : true , unique : true , default:"admin@gmail.com" },
    wallet: {
        balance: { type: Number, required: true, default: 0 },
        transactions: [TransactionSchema],
      },

},{
    timestamps : true 
})


const AdminModel = mongoose.model<AdminInterface>('Admin' , AdminSchema)

export default AdminModel ;