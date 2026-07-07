import type { Response } from "express";
import { statusCodes } from "../constants/enums/statusCodes"
import { CustomError } from "../utils/custom-error";

export function createResponse<T>(
  response: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null = null,
): void {
  response.status(statusCode).json({
    success,
    message,
    data,
  });
}

export const errorResponse = (response: Response, error: unknown): void => {
  const errorMessage =
    error instanceof CustomError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Something unexpected happened, Try Again Later";

  console.log("ErrorResponse : ", error);
  createResponse(
    response,
    error instanceof CustomError
      ? error.statusCode
      : statusCodes.INTERNAL_SERVER_ERROR,
    false,
    errorMessage,
  );
};