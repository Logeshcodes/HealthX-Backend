import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export default class JwtService {

    async createToken(payload: Object): Promise<string> {

        const secret = process.env.JWT_SECRET ||'mySecertPassword' ;

        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        
        // Sign the token with the validated secret
        const verifyToken = await jwt.sign(payload, secret, {
            expiresIn: "1hr",
        });

        return verifyToken;
    }


    async accessToken(payload: Object): Promise<string> {

        const secret = process.env.JWT_SECRET || 'mySecertPassword';

        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        // Sign the token with the validated secret
        const verifyToken = await jwt.sign(payload, secret, {
            expiresIn: "1hr",
        });

        console.log("secert :" , secret )
        console.log("verifyToken :" , verifyToken )

        return verifyToken;
    }

    async refreshToken(payload: Object): Promise<string> {
        const secret = process.env.JWT_SECRET  || 'mySecertPassword';

        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        // Sign the token with the validated secret
        const verifyToken =await jwt.sign(payload, secret, {
            expiresIn: "3hr",
        });

        return verifyToken;
    }

    async verifyToken(token:string):Promise<any>{

        try {
            console.log("verify ")
            const secret = process.env.JWT_SECRET || "mySecertPassword" ;
            console.log(secret,"secret")
            
            console.log("Token being verified:", token);
            const data= await jwt.verify(token,secret)
            console.log(data,"verify data")
            return data
        } catch (error) {
            throw error
            
        }
    }

}