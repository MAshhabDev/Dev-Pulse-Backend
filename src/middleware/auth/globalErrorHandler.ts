import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  let errors: any = [
    {
      path: "",
      message: err.message || "Something went wrong",
    },
  ];

  if (err.code === "23505") {
    statusCode = 400;
    message = "Duplicate Resource Conflict";
    errors = [
      {
        path: "email",
        message:
          "This email is already registered. Please use a different email.",
      },
    ];
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors,
  });
};

export default globalErrorHandler;
