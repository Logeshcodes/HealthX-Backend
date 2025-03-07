import JwtService from "../utils/jwt";
import { Request, Response } from "express";


import { config } from 'dotenv';


config()

export class AdminController{


 
    private JWT: JwtService;

    constructor(){
         this.JWT=new JwtService();
       
    }

    

    public async login(req:Request,res:Response):Promise<any>{
      // const AdminEmail= process.env.ADMIN_EMAIL
      // const AdminPassword=process.env.ADMIN_PASSWORD
      const AdminEmail= "admin@gmail.com"
      const AdminPassword= "Admin@123"
      try {
          const {email,password}=req.body
          if(email!==AdminEmail){
              return res.send({
                  success:false,
                  message:"Email Wrong"
              })
          }
          if(password!==AdminPassword){
              return res.send({
                  success:false,
                  message:"Password Wrong"
              })
          }
          console.log(email,password,"admin")
          const accesstoken = await this.JWT.accessToken({ email, role:"admin" });
          const refreshtoken = await this.JWT.accessToken({ email, role:"admin" });
          return res
          .cookie("accessToken3", accesstoken,{ httpOnly: true })
          .cookie("refreshToken3", refreshtoken,{ httpOnly: true })
          .send({
              success:true,
              message:"Welcome Admin",
              data:{email,role:"admin"}
          })
          
      } catch (error) {
          throw error
      }
  }

  async logout(req: Request, res: Response) {
    try {
      console.log("admin logged out");
      res.clearCookie("accessToken3", { path: "/", httpOnly: true, secure: true });
      res.clearCookie("refreshToken3", { path: "/", httpOnly: true, secure: true });

      res.status(200).send({ success: true, message: "Admin Logout successfully" });

    } catch (error) {
      console.error("Error during admin logout:", error);
      res.status(500).send({ success: false, message: "Logout failed. Please try again." });
    }
  }
  

 
      

     
      
    
}