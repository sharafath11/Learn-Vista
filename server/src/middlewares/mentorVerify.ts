import { Request, Response, NextFunction } from "express";
import { clearTokens, verifyAccessToken } from "../utils/JWTtoken";
import { sendResponse } from "../utils/ResANDError";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

type Role = "admin" | "user" | "mentor";

interface DecodedToken {
  id: string;
  role: Role;
}

declare module "express-serve-static-core" {
  interface Request {
    mentor?: DecodedToken;
  }
}

export const verifyMentor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.cookies?.token;

  if (!accessToken) {
    sendResponse(res, 401, "Unauthorized: No token provided", false);
    return;
  }

  try {
    const decoded = verifyAccessToken(accessToken) as DecodedToken;

    if (decoded?.id && decoded.role === "mentor") {
      req.mentor = decoded;
      next();
      return;
    }

    clearTokens(res);
    sendResponse(res, 403, "Forbidden: Not a mentor", false);

  } catch (error) {
    if (error instanceof TokenExpiredError) {
      clearTokens(res);
      sendResponse(res, 401, "Access token expired", false);
      return;
    }

    if (error instanceof JsonWebTokenError) {
      clearTokens(res);
      sendResponse(res, 401, "Invalid access token", false);
      return;
    }

    sendResponse(res, 500, "Internal server error", false);
  }
};
