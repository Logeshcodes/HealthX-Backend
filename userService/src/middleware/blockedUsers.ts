import JwtService from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

import { StatusCode } from "../utils/enum";
import { ResponseError } from "../utils/constants";



export const IsUserBlocked = async ( req : Request , res : Response , next : NextFunction) : Promise<void> =>{

    try {

        const Token =  req.cookies.accessToken ;

        if(!Token){
            res.status(StatusCode.UNAUTHORIZED).send(ResponseError.ACCESS_FORBIDDEN);
            return 
        }

        const JWT = new JwtService();
        const decode = await JWT.verifyToken(Token);
        if (decode) {
            if (!decode.isBlocked) {
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
            return 
        }

        const JWT = new JwtService();
        const decode = await JWT.verifyToken(Token);
        if (decode) {
            if (!decode.isBlocked) {
              res.status(StatusCode.UNAUTHORIZED).send(ResponseError.ACCESS_FORBIDDEN);
              return;
            }
          }

    next();

    } 
    catch (error){ throw error }


}