import mongoose, { Schema, Document} from "mongoose";

export interface OtpInterface extends Document {
    
    email: string,
    otp: string,
    createdAt: Date,
    expiresAt: Date
}

const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: new Date(Date.now() + 60 * 60 * 1000),
        index: {
            expires: '1h'
        }
    }

})

const otpModel = mongoose.model<OtpInterface>('Otp' , otpSchema)

export default otpModel ;