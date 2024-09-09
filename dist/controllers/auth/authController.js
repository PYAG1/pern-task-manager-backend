"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const _types_1 = require("../../types/@types");
const db_1 = require("../../config/db");
const encryption_service_1 = require("../../services/encryption.service");
const auth_services_1 = require("../../services/auth.services");
async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        // Validate input
        if (!username || !password || !email) {
            return res.status(_types_1.HttpStatus.BAD_REQUEST).send({
                status: false,
                message: "Please provide username, email, and password",
            });
        }
        // Check if user already exists
        const foundUserQuery = "SELECT * FROM users WHERE email = $1 OR username = $2";
        const foundUserResult = await db_1.pool.query(foundUserQuery, [email, username]);
        if (foundUserResult.rowCount > 0) {
            return res.status(_types_1.HttpStatus.CONFLICT).send({
                status: false,
                message: "Username or email already exists",
            });
        }
        // Hash the password
        const hashedPassword = await (0, encryption_service_1.hashPassword)(password);
        // Insert new user into the database
        const insertUserQuery = `
      INSERT INTO users (username, email, password_hash, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING user_id, username, email;
    `;
        const newUserResult = await db_1.pool.query(insertUserQuery, [username, email, hashedPassword]);
        return res.status(_types_1.HttpStatus.CREATED).send({
            status: true,
            message: "User registered successfully",
            data: newUserResult.rows[0],
        });
    }
    catch (error) {
        return res.status(_types_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: false,
            message: "An error occurred during registration",
            error: error.message, // Only send the error message to avoid leaking sensitive information
        });
    }
}
async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(_types_1.HttpStatus.BAD_REQUEST).send({
                status: false,
                message: "Provide both email and password"
            });
        }
        const foundUserquery = " SELECT * FROM users WHERE username = $1";
        const foundUser = await db_1.pool.query(foundUserquery, [username]);
        if (foundUser.rowCount < 0) {
            return res.status(_types_1.HttpStatus.NOT_FOUND).send({
                status: false,
                message: "User not found"
            });
        }
        const match = await (0, encryption_service_1.compare)(password, foundUser.rows[0].password_hash);
        if (!match) {
            return res.status(_types_1.HttpStatus.UNAUTHORIZED).send({
                status: false,
                message: "Invalid credentials",
            });
        }
        const token = await (0, auth_services_1.createToken)({
            id: foundUser.user_id,
        });
        res.status(_types_1.HttpStatus.OK).send({
            status: true,
            message: "Login successful",
            data: { token },
        });
    }
    catch (error) {
        return res.status(_types_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: false,
            message: "An error occurred during login",
            error: error.message,
        });
    }
}
