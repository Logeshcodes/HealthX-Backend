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
const kafkajs_1 = require("kafkajs");
function produce(topic, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = kafkaConfig_1.default.producer({
            createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner,
        });
        try {
            console.log("Connecting to Auth-Service Producer...");
            yield producer.connect();
            const messageValue = typeof value === "object" ? JSON.stringify(value) : value;
            console.log(`Sending message to topic: ${topic} => ${messageValue}`);
            yield producer.send({
                topic,
                messages: [{ value: messageValue }],
            });
            console.log("Message sent successfully from Auth-Producer.");
        }
        catch (error) {
            console.error("Error in Auth-Producer:", error.message, error.stack);
        }
        finally {
            yield producer.disconnect();
            console.log("Auth-Producer disconnected.");
        }
    });
}
exports.default = produce;
