import { Response,Request, NextFunction } from "express";
import { HttpStatus, Irequest, tokenPayload } from "../types/@types";
import jwt from "jsonwebtoken"
export async function verifyJWT(req:Irequest,res:Response,next:NextFunction){
try {
    const header = req.headers["authorization"];
const token= header ? header.split("")[1]: undefined;

if(!token){
return res.status(HttpStatus.FORBIDDEN).send({
    status:false,
    message:"Unauthorized"
})
}
const payload = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)as tokenPayload 
req.user_id = payload.id
next()
} catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        status:false,
        message:error
    })
}
}


//<Header>.<Payload>.<Signature>
