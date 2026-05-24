import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../config";
import { pool } from "../../db";
import type { ILogin } from "./auth.interface";

const signInToDb = async (payload: ILogin) => {
  const { email, password } = payload;

  const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (userData.rows.length === 0) {
    const error: any = new Error("Invalid credentials");
    error.statusCode = 401; 
    throw error;
  }

  const user = userData.rows[0];

  const matchPass = await bcrypt.compare(password, user.password);

  if (!matchPass) {
    throw new Error("Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, config.access_secret as string, {
    expiresIn: "1d",
  });

  delete user.password;

  return {
    token: accessToken,
    user: user,
  };
};

export const authService = {
  signInToDb,
};
