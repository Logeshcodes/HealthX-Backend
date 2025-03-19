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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationControllers = void 0;
const sendForgotPasswordEmail_1 = require("../utils/sendForgotPasswordEmail");
const sendOtpEmail_1 = require("../utils/sendOtpEmail");
const verifiedEmail_1 = require("../utils/verifiedEmail");
const sendRejectionDoctorEmail_1 = require("../utils/sendRejectionDoctorEmail");
const SendApprovalEmail_1 = require("../utils/SendApprovalEmail");
class NotificationControllers {
    constructor() {
        this.sendEmail = new sendOtpEmail_1.SendEmail();
        this.sendForgotPasswordEmail = new sendForgotPasswordEmail_1.SendForgotEmail();
        this.sendVerifiedEmail = new verifiedEmail_1.SendVerifiedEmail();
        this.sendRejectionEmail = new sendRejectionDoctorEmail_1.SendRejectionEmail();
        this.sendApprovalEmail = new SendApprovalEmail_1.SendApprovalEmail();
    }
    sendOtpEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = data;
                yield this.sendEmail.sentEmailVerification(email, otp);
                console.log("OTP email has been sent");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendForgotEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = data;
                yield this.sendForgotPasswordEmail.sendEmailVerification(email, otp);
                console.log("Forgot OTP email has been sent");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendVerifiedDoctorEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, username } = data;
                console.log(email, username, "mail>>>");
                yield this.sendVerifiedEmail.sentEmailVerification(username, email);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendRejectionDoctorEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, rejectedReason } = data;
                console.log(email, rejectedReason, "mail>>>");
                yield this.sendRejectionEmail.sendRejectionDoctorEmail(email, rejectedReason);
                console.log("document-rejection email has been sent");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendApprovalDoctorEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = data;
                console.log(email, "mail>>>");
                yield this.sendApprovalEmail.sendApprovalDoctorEmail(email);
                console.log("document-approval email has been sent");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.NotificationControllers = NotificationControllers;
