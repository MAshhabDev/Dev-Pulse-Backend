import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const signUp = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const result = await userService.createUserIntoDb(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";

    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
    });
  }
};

export const userController = { signUp };
