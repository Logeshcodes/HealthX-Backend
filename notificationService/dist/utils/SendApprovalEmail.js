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
exports.SendApprovalEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class SendApprovalEmail {
    sendApprovalDoctorEmail(email) {
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
            const sendApprovalEmail = (toEmail) => __awaiter(this, void 0, void 0, function* () {
                const mailOptions = {
                    from: process.env.EMAIL_ACCOUNT, // Sender email
                    to: toEmail, // Recipient email
                    subject: 'Congratulations: Document Approval Notification from HealthX',
                    text: `Dear Doctor,\n\nWe are delighted to inform you that your documents (Medical License and Degree Certificate) have been approved. Welcome to HealthX!\n\nYour application has been successfully approved, and you are now part of a network that strives to serve the community with care and compassion.\n\nThank you for joining us. Together, we will continue to serve people and ensure better healthcare.\n\nBest Regards,\nThe HealthX Team`,
                    html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7; text-align: center;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #2E8B57;">Document Approval Notice</h2>
              <p style="font-size: 1.1em;">Dear Doctor,</p>
              <p>We are delighted to inform you that your documents (Medical License and Degree Certificate) have been approved.</p>

              <div style="margin: 20px 0; padding: 15px; background-color: #e0ffe0; color: #2E8B57; border: 1px solid #b2f5b2; border-radius: 4px;">
                <strong>Welcome to HealthX!</strong> Your application has been successfully approved. We are excited to have you on board.
              </div>

              <p>Thank you for joining us. Together, we will continue to serve people and ensure better healthcare.</p>

              <br>
              <p>Warm Regards,</p>

              <p style="font-weight: bold;">The HealthX Team</p>
            </div>
          </div>
        `,
                };
                try {
                    const info = yield transporter.sendMail(mailOptions);
                    console.log(`Approval email sent successfully: ${info.response}`);
                    return info;
                }
                catch (error) {
                    console.error('Error sending approval email:', error);
                    throw new Error(`Failed to send approval email: ${error.message}`);
                }
            });
            yield sendApprovalEmail(email);
        });
    }
}
exports.SendApprovalEmail = SendApprovalEmail;
