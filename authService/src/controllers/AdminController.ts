import JwtService from "../utils/jwt";
import { Request, Response } from "express";

import { config } from "dotenv";
import produce from "../config/kafka/producer";
import { ResponseError } from "../utils/constants";
import { StatusCode } from "../utils/enum";
import { IAdminControllers } from "./interface/IAdminControllers";
import IAdminService from "../services/interfaces/IAdminService";

config();

export class AdminController implements IAdminControllers {

  private adminService: IAdminService;
  private JWT: JwtService;
  constructor(adminService: IAdminService) {
    this.JWT = new JwtService();
    this.adminService = adminService;
  }

  public async login(req: Request, res: Response): Promise<any> {
    const AdminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const AdminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    try {
      const { email, password } = req.body;

      let admin = await this.adminService.getAdminData(email);

      if(!admin){
        admin = await this.adminService.createAdmin(email, password);
        admin && await produce("add-admin", admin);
      }
      else if (email !== AdminEmail) {
        return res.send({
          success: false,
          message: ResponseError.INVAILD_EMAIL,
        });
      }
      else if (password !== AdminPassword) {
        return res.send({
          success: false,
          message: ResponseError.INVAILD_PASSWORD,
        });
      }
      console.log(email, password, "admin");
      const accesstoken = await this.JWT.accessToken({ email, role: "admin" });
      const refreshtoken = await this.JWT.accessToken({ email, role: "admin" });
      return res
        .cookie("accessToken3", accesstoken, { httpOnly: true })
        .cookie("refreshToken3", refreshtoken, { httpOnly: true })
        .send({
          success: true,
          message: "Welcome back, Admin!",
          data: { email, role: "admin" },
        });
    } catch (error) {
      throw error;
    }
  }

  async logout(req: Request, res: Response) {
    try {
      console.log("admin logged out");
      res.clearCookie("accessToken3", {
        path: "/",
        httpOnly: true,
        secure: true,
      });
      res.clearCookie("refreshToken3", {
        path: "/",
        httpOnly: true,
        secure: true,
      });

      res
        .status(StatusCode.OK)
        .send({ success: true, message: ResponseError.ACCOUNT_LOGOUT });
    } catch (error) {
      console.error("Error during admin logout:", error);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send({ success: false, message: ResponseError.INTERNAL_SERVER_ERROR });
    }
  }
}
