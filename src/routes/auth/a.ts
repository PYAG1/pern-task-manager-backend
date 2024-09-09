import { Router } from "express"
import express from "express"
import { login, register } from "../../controllers/auth/authController";
const router:Router= express.Router();

router.post("/register",register)
router.post("/login",login)

export default router