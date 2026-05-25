import type { Request, Response } from "express"; 
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

const signIn = async (req: Request, res: Response) => {
  try {
    const result = await authService.signInToDb(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: errorMessage,
      error: errorMessage, 
    });
  }
};

export const authController = { signIn };
