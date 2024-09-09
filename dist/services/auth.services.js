"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function createToken(payload) {
    try {
        return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10d' });
    }
    catch (error) {
        throw new Error(error);
    }
}
