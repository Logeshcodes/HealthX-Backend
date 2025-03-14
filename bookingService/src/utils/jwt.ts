import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export default class JwtService {

    async createToken(payload: Object): Promise<string> {

        const secret = process.env.JWT_SECRET ||'mySecertPassword' ;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const verifyToken = await jwt.sign(payload, secret, { expiresIn: "1hr"});
        return verifyToken;
    }

    async accessToken(payload: Object): Promise<string> {

        const secret = process.env.JWT_SECRET || 'mySecertPassword';
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const verifyToken = await jwt.sign(payload, secret, {expiresIn: "1hr" });
        return verifyToken;
    }

    async refreshToken(payload: Object): Promise<string> {

        const secret = process.env.JWT_SECRET  || 'mySecertPassword';
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const verifyToken =await jwt.sign(payload, secret, { expiresIn: "3hr"});
        return verifyToken;
    }

    async verifyToken(token:string):Promise<any>{
        try {
            const secret = process.env.JWT_SECRET || "mySecertPassword" ;
            const data= await jwt.verify(token,secret)
            return data
        } catch (error) {throw error}
    }

}