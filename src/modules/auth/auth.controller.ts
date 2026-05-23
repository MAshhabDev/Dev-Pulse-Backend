import type { Request, Response } from "express"; // Request ইম্পোর্ট করা হলো
import { authService } from "./auth.service";

const signIn = async (req: Request, res: Response) => {
  try {
    const result = await authService.signInToDb(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
      errors: error.message,
    });
  }
};

export const authController = { signIn };
