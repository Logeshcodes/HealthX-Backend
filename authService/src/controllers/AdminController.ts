import JwtService from "../utils/jwt";
import { Request, Response } from "express";

import { config } from "dotenv";

import { ResponseError } from "../utils/constants";
import { StatusCode } from "../utils/enum";

config();

export class AdminController {
  private JWT: JwtService;

  constructor() {
    this.JWT = new JwtService();
  }

  public async login(req: Request, res: Response): Promise<any> {
    const AdminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const AdminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    try {
      const { email, password } = req.body;
      if (email !== AdminEmail) {
        return res.send({
          success: false,
          message: ResponseError.INVAILD_EMAIL,
        });
      }
      if (password !== AdminPassword) {
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
