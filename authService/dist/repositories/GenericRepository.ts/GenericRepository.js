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
exports.GenericRespository = void 0;
class GenericRespository {
    constructor(model) {
        this.model = model;
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(payload);
        });
    }
    findOne(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ email: email });
        });
    }
    update(email, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate({ email }, { $set: data }, { new: true, upsert: true });
        });
    }
    delete(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.findOneAndDelete(filter);
        });
    }
}
exports.GenericRespository = GenericRespository;
