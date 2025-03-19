"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendRejectionEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class SendRejectionEmail {
    sendRejectionDoctorEmail(email, rejectedReason) {
        return __awaiter(this, void 0, void 0, function* () {
            // Log environment variables for debugging
            console.log("Sender Email:", process.env.EMAIL_ACCOUNT);
            console.log("Recipient Email:", email);
            // Validate the recipient email
            if (!email || typeof email !== 'string' || !email.includes('@')) {
                throw new Error("Invalid recipient email address");
            }
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_ACCOUNT,
                    pass: process.env.ACCOUNT_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            const sendRejectionEmail = (toEmail, rejectionReason) => __awaiter(this, void 0, void 0, function* () {
                const mailOptions = {
                    from: process.env.EMAIL_ACCOUNT, // Sender email
                    to: toEmail, // Recipient email
                    subject: 'Important: Document Rejection Notification from HealthX',
                    text: `Dear Doctor,\n\nThank you for submitting your documents to HealthX. Upon careful review, we regret to inform you that your documents (Medical License and Degree Certificate) have been rejected.\n\nReason for Rejection: ${rejectionReason}\n\nWe kindly request you to re-upload valid documents for further verification.\n\nIf you need any assistance, please contact us at support@healthx.com.\n\nThank you for your understanding.\n\nBest Regards,\nThe HealthX Team`,
                    html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7; text-align: center;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #E53E3E;">Document Rejection Notice</h2>
              <p style="font-size: 1.1em;">Dear Doctor,</p>
              <p>Thank you for submitting your documents to <strong>HealthX</strong>. Upon review, we regret to inform you that your documents (Medical License and Degree Certificate) have been rejected.</p>
              
              <div style="margin: 20px 0; padding: 15px; background-color: #ffe0e0; color: #D32F2F; border: 1px solid #f5c2c2; border-radius: 4px;">
                <strong>Reason for Rejection:</strong> ${rejectionReason}
              </div>

              <p>Please re-upload valid documents at your earliest convenience for further verification.</p>

              <p>If you have any questions or need assistance, feel free to contact our support team at 
                <a href="mailto:support@healthx.com" style="color: #E53E3E;">support@healthx.com</a>.
              </p>

              <br>
              <p>Thank you for your understanding.</p>

              <p style="font-weight: bold;">The HealthX Team</p>
            </div>
          </div>
        `,
                };
                try {
                    const info = yield transporter.sendMail(mailOptions);
                    console.log(`Rejection email sent successfully: ${info.response}`);
                    return info;
                }
                catch (error) {
                    console.error('Error sending rejection email:', error);
                    throw new Error(`Failed to send rejection email: ${error.message}`);
                }
            });
            yield sendRejectionEmail(email, rejectedReason);
        });
    }
}
exports.SendRejectionEmail = SendRejectionEmail;
