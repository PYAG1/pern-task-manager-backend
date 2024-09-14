import { Request, Response } from "express";
import { HttpStatus, Irequest } from "../../types/@types";
import { pool } from "../../config/db";
import { hashPassword, compare } from "../../services/encryption.service";
import { createToken } from "../../services/auth.services";

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: "Please provide username, email, and password",
      });
    }

    const foundUserQuery =
      "SELECT * FROM users WHERE email = $1 OR username = $2";
    const foundUserResult = await pool.query(foundUserQuery, [email, username]);

    if (foundUserResult.rowCount > 0) {
      return res.status(HttpStatus.CONFLICT).send({
        status: false,
        message: "Username or email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const insertUserQuery = `
      INSERT INTO users (username, email, password_hash, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING user_id, username, email;
    `;
    const newUserResult = await pool.query(insertUserQuery, [
      username,
      email,
      hashedPassword,
    ]);

    return res.status(HttpStatus.CREATED).send({
      status: true,
      message: "User registered successfully",
      data: newUserResult.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "An error occurred during registration",
      error: error.message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: "Provide both username and password",
      });
    }

    const foundUserQuery = "SELECT * FROM users WHERE username = $1";
    const foundUser = await pool.query(foundUserQuery, [username]);

    if (foundUser.rowCount === 0) {
      return res.status(HttpStatus.NOT_FOUND).send({
        status: false,
        message: "User not found",
      });
    }

    const match = await compare(password, foundUser.rows[0].password_hash);
    if (!match) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = await createToken({
      id: foundUser.rows[0].user_id,
    });

    return res.status(HttpStatus.OK).send({
      status: true,
      message: "Login successful",
      data: {
        token,
        user: {
          user_id: foundUser.rows[0].user_id,
          username: foundUser.rows[0].username,
          email: foundUser.rows[0].email,
          created_at: foundUser.rows[0].created_at,
          updated_at: foundUser.rows[0].updated_at,
        },
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "An error occurred during login",
      error: error.message,
    });
  }
}
