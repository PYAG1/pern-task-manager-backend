"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.compare = compare;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltrounds = 10;
async function hashPassword(pwd) {
    try {
        const genSalt = await bcrypt_1.default.genSalt(saltrounds);
        const hashedPws = await bcrypt_1.default.hash(pwd, genSalt);
        return hashedPws;
    }
    catch (error) {
        throw Error(error);
    }
}
async function compare(password, hashPassword) {
    try {
        return bcrypt_1.default.compare(password, hashPassword);
    }
    catch (error) {
        throw Error(error);
    }
}
