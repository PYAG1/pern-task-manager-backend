"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = verifyJWT;
const _types_1 = require("../types/@types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function verifyJWT(req, res, next) {
    try {
        const header = req.headers["authorization"];
        const token = header ? header.split("")[1] : undefined;
        if (!token) {
            return res.status(_types_1.HttpStatus.FORBIDDEN).send({
                status: false,
                message: "Unauthorized"
            });
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user_id = payload.id;
        next();
    }
    catch (error) {
        res.status(_types_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: false,
            message: error
        });
    }
}
//<Header>.<Payload>.<Signature>
