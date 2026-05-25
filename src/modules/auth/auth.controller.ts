import type { Request, Response } from "express"; 
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";


const signUp = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUserIntoDb(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
      if (errorMessage.includes("violates unique constraint") && errorMessage.includes("users_email_key")) {
      return sendResponse(res, {
        statusCode: 400, 
        success: false,
        message: "Duplicate Resource Conflict",
        error: "This email is already registered. Please use a different email.", 
      })
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
    });
  }
};
}



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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: errorMessage,
      error: errorMessage, 
    });
  }
};

export const authController = { signUp, signIn };
