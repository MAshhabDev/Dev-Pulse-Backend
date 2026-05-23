import type { Request, Response } from "express";
import { userService } from "./user.service";

const signUp = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const result = await userService.createUserIntoDb(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message || error,
    });
  }
};

export const userController = { signUp };
