import type { Request, Response } from "express";
import type { TResponse } from "./responseType";

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data !== undefined ? data.data : null,
    error: data.error || null,
  });
};

export default sendResponse;
