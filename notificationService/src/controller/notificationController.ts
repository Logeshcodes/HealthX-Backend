import { SendForgotEmail } from "../utils/sendForgotPasswordEmail";
import { SendEmail } from "../utils/sendOtpEmail";
import {SendVerifiedEmail} from "../utils/verifiedEmail"
import { SendRejectionEmail } from "../utils/sendRejectionDoctorEmail";
import { SendApprovalEmail } from "../utils/SendApprovalEmail";

export class NotificationControllers {
  private sendEmail: SendEmail;
  private sendForgotPasswordEmail: SendForgotEmail;
  private sendVerifiedEmail:SendVerifiedEmail
  private sendRejectionEmail:SendRejectionEmail
  private sendApprovalEmail:SendApprovalEmail
  constructor() {
    this.sendEmail = new SendEmail();
    this.sendForgotPasswordEmail = new SendForgotEmail();
    this.sendVerifiedEmail=new SendVerifiedEmail()
    this.sendRejectionEmail=new SendRejectionEmail()
    this.sendApprovalEmail=new SendApprovalEmail()

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


  async sendRejectionDoctorEmail(data: { email: string; rejectedReason: string }) {
    try {
      const { email,rejectedReason } = data;
      console.log(email,rejectedReason,"mail>>>")
      await this.sendRejectionEmail.sendRejectionDoctorEmail(email , rejectedReason);
      console.log("document-rejection email has been sent");
    } catch (error) {
      console.log(error);
    }
  }

  async sendApprovalDoctorEmail(data: { email: string }) {
    try {
      const { email } = data;
      console.log(email,"mail>>>")
      await this.sendApprovalEmail.sendApprovalDoctorEmail(email );
      console.log("document-rejection email has been sent");
    } catch (error) {
      console.log(error);
    }
  }
}