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
const notificationController_1 = require("../../controller/notificationController");
const kafkaConfig_1 = __importDefault(require("./kafkaConfig"));
function consume() {
    return __awaiter(this, void 0, void 0, function* () {
        const notificatinController = new notificationController_1.NotificationControllers();
        const consumer = kafkaConfig_1.default.consumer({ groupId: "notification-service" });
        try {
            console.log("Connecting to User-Service Consumer...");
            yield consumer.connect();
            yield consumer.subscribe({
                topics: [
                    "send-otp-email",
                    "send-forgotPassword-email",
                    "verified-Doctor-email",
                    "document-rejection-mail",
                    "document-approval-mail"
                ],
                fromBeginning: true,
            });
            console.log("User-Service Consumer is running...");
            yield consumer.run({
                eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, message }) {
                    try {
                        const messageValue = message.value
                            ? JSON.parse(message.value.toString())
                            : null;
                        if (!messageValue) {
                            console.warn(`Empty message received on topic: ${topic}`);
                            return;
                        }
                        switch (topic) {
                            case "send-otp-email":
                                yield notificatinController.sendOtpEmail(messageValue);
                                console.log("Processed send-otp-email event:", messageValue);
                                break;
                            case "send-forgotPassword-email":
                                yield notificatinController.sendForgotEmail(messageValue);
                                console.log("Processing send-forgotPassword-email event:", messageValue);
                                break;
                            case "verified-Doctor-email":
                                yield notificatinController.sendVerifiedDoctorEmail(messageValue);
                                console.log("Processing verified-Doctor-email event:", messageValue);
                                break;
                            case "document-rejection-mail":
                                yield notificatinController.sendRejectionDoctorEmail(messageValue);
                                console.log("Processing document-rejection-mail event:", messageValue);
                                break;
                            case "document-approval-mail":
                                yield notificatinController.sendApprovalDoctorEmail(messageValue);
                                console.log("Processing document-approval-mail event:", messageValue);
                                break;
                            default:
                                console.warn(`No handler for topic: ${topic}`);
                        }
                    }
                    catch (error) {
                        console.error(`Error processing message from topic ${topic}:`, error.message);
                    }
                }),
            });
        }
        catch (error) {
            console.error("Error in User-Service Consumer:", error.message, error.stack);
        }
    });
}
exports.default = consume;
