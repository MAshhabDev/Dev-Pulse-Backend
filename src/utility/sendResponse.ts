import type { Response } from "express";
import type { TResponse } from "./responseType";

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    ...(data.data !== undefined && { data: data.data }),
    error: data.error || null,
  });
};

export default sendResponse;