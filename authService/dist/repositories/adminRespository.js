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
exports.AdminRepository = void 0;
const adminModel_1 = __importDefault(require("../models/adminModel"));
const GenericRepository_1 = require("./GenericRepository.ts/GenericRepository");
class AdminRepository extends GenericRepository_1.GenericRespository {
    constructor() {
        super(adminModel_1.default);
    }
    createAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = { email, password };
            return yield this.create(payload);
        });
    }
    getAdminData(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne(email);
        });
    }
}
exports.AdminRepository = AdminRepository;
