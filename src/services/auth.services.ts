import jwt from "jsonwebtoken"
import { tokenPayload } from "../types/@types"
import dotenv from "dotenv"
dotenv.config()

export async function createToken (payload: tokenPayload){
    try {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '10d'})
    } catch (error:any) {
        throw new Error(error)
    }
}