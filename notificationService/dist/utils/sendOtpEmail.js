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
exports.SendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class SendEmail {
    sentEmailVerification(email, verification) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_ACCOUNT,
                    pass: process.env.ACCOUNT_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            const sendVerificationEmail = (toEmail, verificationCode) => __awaiter(this, void 0, void 0, function* () {
                const mailOptions = {
                    from: process.env.USER_EMAIL, // Will set this via env variables later
                    to: toEmail,
                    subject: '🌟 Welcome to HealthX - Verify Your Email 🌟',
                    text: `Hello,\n\nYour verification code is: ${verificationCode}\n\nThanks,\nThe HealthX Team`, // Plain-text fallback
                    html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; text-align: center; border-radius: 8px; background-color: #f7f7f7; background: url('https://cdn.wallpapersafari.com/13/89/wb4WOU.jpg') no-repeat center center; background-size: cover;">
                        <div style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 8px; display: inline-block; width: 80%; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #4CAF50; margin-bottom: 10px;">Welcome to HealthX, !</h2>
                            <p style="font-size: 1.1em; margin-bottom: 20px;">We're excited to have you onboard. Please use the verification code below to complete your email verification:</p>
                            <div style="margin: 20px 0; font-size: 1.5em; font-weight: bold; color: #4CAF50; background: #f0f0f0; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                                ${verificationCode}
                            </div>
                            <p>If you didn’t request this, please ignore this email.</p>
                            <br>
                            <p>Thank you,</p>
                            <p><strong>The HealthX Team</strong></p>
                            <div style="margin-top: 20px; font-size: 0.9em; color: #777;">
                                <p>Follow us on:</p>
                                <a href="https://twitter.com/HealthX" style="margin: 0 5px; text-decoration: none; color: #4CAF50;">Twitter</a> |
                                <a href="https://facebook.com/HealthX" style="margin: 0 5px; text-decoration: none; color: #4CAF50;">Facebook</a> |
                                <a href="https://instagram.com/HealthX" style="margin: 0 5px; text-decoration: none; color: #4CAF50;">Instagram</a>
                            </div>
                        </div>
                    </div>
                `,
                };
                try {
                    const info = yield transporter.sendMail(mailOptions);
                    console.log(`Email sent successfully: ${info.response}`);
                    return info;
                }
                catch (error) {
                    console.error('Error sending email:', error);
                    throw new Error('Failed to send verification email');
                }
            });
            yield sendVerificationEmail(email, verification);
        });
    }
}
exports.SendEmail = SendEmail;
