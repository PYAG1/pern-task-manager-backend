import { Request, Response } from "express";
import { HttpStatus, Irequest } from "../../types/@types";
import { pool } from "../../config/db";
import { hashPassword, compare } from "../../services/encryption.service";
import { createToken } from "../../services/auth.services";

// Function to handle user registration
export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !password || !email) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: "Please provide username, email, and password",
      });
    }

    // Check if a user with the same email or username already exists
    const foundUserQuery =
      "SELECT * FROM users WHERE email = $1 OR username = $2";
    const foundUserResult = await pool.query(foundUserQuery, [email, username]);

    if (foundUserResult.rowCount > 0) {
      return res.status(HttpStatus.CONFLICT).send({
        status: false,
        message: "Username or email already exists",
      });
    }

    // Hash the user's password
    const hashedPassword = await hashPassword(password);

    // Insert new user into the database
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

    // Send back a response with the newly registered user's data
    return res.status(HttpStatus.CREATED).send({
      status: true,
      message: "User registered successfully",
      data: newUserResult.rows[0], // Return the user data excluding the password
    });
  } catch (error) {
    console.error(error);

    // Return an internal server error message
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "An error occurred during registration",
      error: error.message, // Send the error message (useful for debugging)
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: "Provide both email and password",
      });
    }

    const foundUserquery = " SELECT * FROM users WHERE username = $1";
    const foundUser = await pool.query(foundUserquery, [username]);

    if (foundUser.rowCount < 0) {
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
    console.log(foundUser.rows[0].user_id);

    const token = await createToken({
      id: foundUser.rows[0].user_id,
    });

    res.status(HttpStatus.OK).send({
      status: true,
      message: "Login successful",
      data: {
        token,
        user: {
          user_id: foundUser.rows[0].user_id,
          username: foundUser.rows[0].usename,
          email: foundUser.rows[0].email,
          created_at: foundUser.rows[0].created_at,
          updated_at: foundUser.rows[0].updated_at,
        },
      },
    });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "An error occurred during login",
      error: error.message,
    });
  }
}
