import { Response } from "express";
import { CustomError } from "../types/errorTypes";

export function throwError(message: string, statusCode = 400): never {
  console.error("Throwing error:", message);
  const error: CustomError = new Error(message);
  error.statusCode = statusCode;
  throw error;
}
export function sendResponse<T>(
  res: Response,
  status: number,
  msg: string,
  ok: boolean,
  data?: T
): void {
  console.error(msg);
  res.status(status).json({ ok, msg, data });
}
export function handleControllerError(
  res: Response,
  error: unknown,
  defaultStatus = 400
): void {
  let message = "Something went wrong";
  let statusCode = defaultStatus;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    message = (error as { message: string }).message;

    if ("statusCode" in error && typeof (error as { statusCode: unknown }).statusCode === "number") {
      statusCode = (error as { statusCode: number }).statusCode;
    }
  }

  console.error(message);
  sendResponse(res, statusCode, message, false);
}
