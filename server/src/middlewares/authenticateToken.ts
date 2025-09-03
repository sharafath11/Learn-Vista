import { Request, Response, NextFunction } from "express";
import { clearTokens, verifyAccessToken } from "../utils/JWTtoken";
import { sendResponse } from "../utils/ResANDError";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.token;

  if (!accessToken) {
    return sendResponse(res, 401, "Unauthorized: No token provided", true);
  }

  try {
    const decoded = verifyAccessToken(accessToken);

    if (decoded?.id && decoded.role === "user") {
      return next();
    }

    clearTokens(res);
    return sendResponse(res, 403, "Forbidden: Invalid role", true);

  } catch (error) {
    if (error instanceof TokenExpiredError) {
      clearTokens(res);
      return sendResponse(res, 401, "Access token expired", true);
    }

    if (error instanceof JsonWebTokenError) {
      clearTokens(res);
      return sendResponse(res, 401, "Invalid access token", true);
    }

    return sendResponse(res, 500, "Internal server error", true);
  }
};
