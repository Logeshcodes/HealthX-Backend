import JwtService from "../utils/jwt";
import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../utils/enum";
import { ResponseError } from "../utils/constants";
import UserModel from "../models/userModel";
import DoctorModel from "../models/doctorModel";

export const IsUserBlocked = async ( req : Request , res : Response , next : NextFunction) : Promise<void> =>{

    try {

        const Token =  req.cookies.accessToken ;
        if(!Token){
            res.status(StatusCode.UNAUTHORIZED).send(ResponseError.ACCESS_FORBIDDEN);
            return ;
        }

        const JWT = new JwtService();
        const decode = await JWT.verifyToken(Token);
        if (decode) {
            console.log("decode data email , role.." , decode.email,  decode.role )
            
            if (decode.email && decode.role === 'User') {

              const email = decode.email ;
              const userData = await UserModel.findOne({ email : email });
              if(userData?.isBlocked){
                res.status(StatusCode.UNAUTHORIZED).send(ResponseError.ACCESS_FORBIDDEN);
                return;
              }
            }else{
              res.status(StatusCode.UNAUTHORIZED).send(ResponseError.ACCESS_FORBIDDEN);
              return;
            }
    }
    next();
    } 
    catch (error){ throw error }
}




export const IsDoctorBlocked = async ( req : Request , res : Response , next : NextFunction) : Promise<void> =>{

    try {
        const Token =  req.cookies.accessToken2 ;

        if(!Token){
            res.status(StatusCode.UNAUTHORIZED).send(ResponseError.ACCESS_FORBIDDEN);
            return ;
        }
        const JWT = new JwtService();
        const decode = await JWT.verifyToken(Token);
        if (decode) {
            console.log("decode data email , role.." , decode.email,  decode.role )
            
            if (decode.email && decode.role === 'Doctor') {
              const email = decode.email ;
              const doctorData = await DoctorModel.findOne({ email : email });
              if(doctorData?.isBlocked){
                res.status(StatusCode.UNAUTHORIZED).send(ResponseError.ACCESS_FORBIDDEN);
                return;
              }
            }else{
              res.status(StatusCode.UNAUTHORIZED).send(ResponseError.ACCESS_FORBIDDEN);
              return;
            }
    }
    next();
    } 
    catch (error){ throw error };
}