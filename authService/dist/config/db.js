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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.ENV_MODE === "production") {
    dotenv_1.default.config({ path: ".env.production" });
}
else {
    dotenv_1.default.config({ path: ".env.development" });
}
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("\nprocess.env.MONGO_URL : ", process.env.MONGO_URL);
        let connect = yield mongoose_1.default.connect(`${process.env.MONGO_URL}`);
        console.log(`DB connected : ${connect.connection.host}`);
    }
    catch (error) {
        console.log("MongoDB Error : ", error.message);
    }
});
exports.default = connectDB;
