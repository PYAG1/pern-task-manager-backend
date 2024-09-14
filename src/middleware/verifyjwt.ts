import { Response, Request, NextFunction } from "express";
import { HttpStatus, Irequest, tokenPayload } from "../types/@types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export async function verifyJWT(
    req: Irequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const header = req.headers["authorization"];
      const token = header ? header.split(" ")[1] : undefined; 
  
      if (!token) {
        return res.status(403).send({
          status: false,
          message: "Unauthorized: No token provided",
        });
      }
  
      const payload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || "defaultsecret"
      ) as tokenPayload;
  
      req.user_id = payload.id;
      next();
    } catch (error) {
      return res.status(401).send({
        status: false,
        message: "Unauthorized: Invalid token",
      });
    }
  }
//<Header>.<Payload>.<Signature>
