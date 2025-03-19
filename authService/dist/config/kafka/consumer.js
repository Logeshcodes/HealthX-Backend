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
const kafkaConfig_1 = __importDefault(require("./kafkaConfig"));
const dependencyInjector_1 = require("../dependencyInjector");
function consume() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafkaConfig_1.default.consumer({ groupId: "auth-service" });
        try {
            console.log("Connecting to User-Service Consumer...");
            yield consumer.connect();
            yield consumer.subscribe({
                topics: [
                    "update-password-user",
                    "update-profile-user",
                    "block-user",
                    "update-password-doctor",
                    "update-profile-doctor",
                    "block-doctor",
                ],
                fromBeginning: true,
            });
            console.log("User-Service Consumer is running...\n");
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
                            case "update-password-user":
                                yield dependencyInjector_1.userController.updatePassword(messageValue);
                                console.log("Processed update-password-user event:", messageValue);
                                break;
                            case "update-profile-user":
                                yield dependencyInjector_1.userController.updateProfile(messageValue);
                                console.log("Processing update-profile-user event:", messageValue);
                                break;
                            case "block-user":
                                yield dependencyInjector_1.userController.blockUser(messageValue);
                                console.log("Processing block-user event:", messageValue);
                                break;
                            //doctor
                            case "update-password-doctor":
                                yield dependencyInjector_1.doctorController.updatePassword(messageValue);
                                console.log("Processed update-password-doctor event:", messageValue);
                                break;
                            case "update-profile-doctor":
                                yield dependencyInjector_1.doctorController.updateProfile(messageValue);
                                console.log("Processed update-profile-doctor event:", messageValue);
                                break;
                            case "block-doctor":
                                yield dependencyInjector_1.doctorController.blockDoctor(messageValue);
                                console.log("Processing block-doctor event:", messageValue);
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
