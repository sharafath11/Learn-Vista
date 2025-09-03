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
    admin?: DecodedToken;
  }
}

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.token;

  if (!accessToken) {
    return sendResponse(res, 401, "Unauthorized: No token provided", false);
  }

  try {
    const decoded = verifyAccessToken(accessToken) as DecodedToken;

    if (decoded?.id && decoded.role === "admin") {
      req.admin = decoded;
      return next();
    }

    clearTokens(res);
    return sendResponse(res, 403, "Forbidden: Not an admin", false);

  } catch (error) {
    if (error instanceof TokenExpiredError) {
      clearTokens(res);
      return sendResponse(res, 401, "Access token expired", false);
    }

    if (error instanceof JsonWebTokenError) {
      clearTokens(res);
      return sendResponse(res, 401, "Invalid access token", false);
    }

    return sendResponse(res, 500, "Internal server error", false);
  }
};

export default verifyAdmin;
