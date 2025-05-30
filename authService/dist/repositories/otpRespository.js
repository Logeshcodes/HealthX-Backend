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
exports.OtpRespository = void 0;
const GenericRepository_1 = require("./GenericRepository.ts/GenericRepository");
const otpModel_1 = __importDefault(require("../models/otpModel"));
class OtpRespository extends GenericRepository_1.GenericRespository {
    constructor() {
        super(otpModel_1.default);
    }
    createOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.update(email, { otp: otp });
            console.log("responseOTP : ", response);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (response === null || response === void 0 ? void 0 : response._id) {
                    yield otpModel_1.default.findByIdAndDelete(response._id);
                }
            }), 1200000);
            return response;
        });
    }
    findOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.findOne(email);
            console.log(response, "otp-repositry");
            return response;
        });
    }
    deleteOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("email id , repo", email);
            yield this.delete({ email: email });
        });
    }
}
exports.OtpRespository = OtpRespository;
