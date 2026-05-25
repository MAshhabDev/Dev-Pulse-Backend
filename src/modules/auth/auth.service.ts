import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../config";
import { pool } from "../../db";
import type { ILogin, IUser } from "./auth.interface";

const createUserIntoDb = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    
    INSERT INTO users (name ,email,password,role) VALUES($1,$2,$3,$4)
    RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result.rows[0];
};

const signInToDb = async (payload: ILogin) => {
  const { email, password } = payload;

  const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (userData.rows.length === 0) {
    throw new Error("Invalid credentials");
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
  createUserIntoDb,
  signInToDb,
};
