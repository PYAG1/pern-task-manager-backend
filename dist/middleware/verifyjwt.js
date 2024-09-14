"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function verifyJWT(req, res, next) {
    try {
        const header = req.headers["authorization"];
        const token = header ? header.split(" ")[1] : undefined;
        if (!token) {
            return res.status(403).send({
                status: false,
                message: "Unauthorized: No token provided",
            });
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET || "defaultsecret");
        req.user_id = payload.id;
        next();
    }
    catch (error) {
        return res.status(401).send({
            status: false,
            message: "Unauthorized: Invalid token",
        });
    }
}
//<Header>.<Payload>.<Signature>
