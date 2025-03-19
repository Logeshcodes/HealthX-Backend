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
exports.UserRepository = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const GenericRepository_1 = require("./GenericRepository.ts/GenericRepository");
class UserRepository extends GenericRepository_1.GenericRespository {
    constructor() {
        super(userModel_1.default);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne(email);
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(userData);
        });
    }
    googleLogin(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createUser(userData);
        });
    }
    updateProfile(email, profilePicture) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update(email, { profilePicture: profilePicture });
        });
    }
    resetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update(email, { hashedPassword: password });
        });
    }
    blockUser(email, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update(email, { isBlocked: isBlocked });
        });
    }
}
exports.UserRepository = UserRepository;
