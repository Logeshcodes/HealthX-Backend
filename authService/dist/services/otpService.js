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
class OtpService {
    constructor(otpRespository) {
        this.otpRespository = otpRespository;
    }
    createOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.otpRespository.createOtp(email, otp);
        });
    }
    findOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.otpRespository.findOtp(email);
        });
    }
    deleteOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.otpRespository.deleteOtp(email);
        });
    }
}
exports.default = OtpService;
