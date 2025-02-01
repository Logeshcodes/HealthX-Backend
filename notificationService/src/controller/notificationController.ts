import { SendForgotEmail } from "../utils/sendForgotPasswordEmail";
import { SendEmail } from "../utils/sendOtpEmail";
import {SendVerifiedEmail} from "../utils/verifiedEmail"

export class NotificationControllers {
  private sendEmail: SendEmail;
  private sendForgotPasswordEmail: SendForgotEmail;
  private sendVerifiedEmail:SendVerifiedEmail
  constructor() {
    this.sendEmail = new SendEmail();
    this.sendForgotPasswordEmail = new SendForgotEmail();
    this.sendVerifiedEmail=new SendVerifiedEmail()
  }

  async sendOtpEmail(data: { email: string; otp: string }) {
    try {
      const { email, otp } = data;

      await this.sendEmail.sentEmailVerification(email, otp);
      console.log("OTP email has been sent");
    } catch (error) {
      console.log(error);
    }
  }
  async sendForgotEmail(data: { email: string; otp: string }) {
    try {
      const { email, otp } = data;
      await this.sendForgotPasswordEmail.sendEmailVerification(email, otp);
      console.log("Forgot OTP email has been sent");
    } catch (error) {
      console.log(error);
    }
  }
  async sendVerifiedDoctorEmail(data: { email: string; username: string }) {
    try {
      const { email,username } = data;
      console.log(email,username,"mail>>>")
      await this.sendVerifiedEmail.sentEmailVerification(username,email);
      console.log("Forgot OTP email has been sent");
    } catch (error) {
      console.log(error);
    }
  }
}