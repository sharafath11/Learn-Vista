import { Request, Response, NextFunction } from "express";
import { clearTokens, clearTokensWithoutResponse, refreshAccessToken, setTokensInCookies, verifyAccessToken } from "../utils/jwtToken";
import { sendResponse } from "../utils/resAndError";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { Messages } from "../constants/messages";
import { StatusCode } from "../enums/statusCode.enum";
import { IDecodedToken } from "../types/adminTypes";




declare module "express-serve-static-core" {
  interface Request {
    mentor?: IDecodedToken;
  }
}

export const verifyMentor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.token;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    return sendResponse(res, StatusCode.UNAUTHORIZED, Messages.AUTH.AUTH_REQUIRED, false);
  }

  try {
    const decoded = verifyAccessToken(accessToken) as IDecodedToken;

    if (decoded?.id && decoded.role === "mentor") {
      req.mentor = decoded;
      return next();
    }

    clearTokensWithoutResponse(res);
    return sendResponse(res, StatusCode.FORBIDDEN, Messages.COMMON.ACCESS_DENIED, false);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      if (!refreshToken) {
        clearTokensWithoutResponse(res);
        return sendResponse(res, StatusCode.UNAUTHORIZED, Messages.AUTH.INVALID_TOKEN, false);
      }

      try {
        const newTokens = refreshAccessToken(refreshToken);
        if (!newTokens) {
          clearTokensWithoutResponse(res);
          return sendResponse(res, StatusCode.UNAUTHORIZED, Messages.SHARED.INVALID_TOKEN, false);
        }

        setTokensInCookies(res, newTokens.accessToken, newTokens.refreshToken);

        const decoded = verifyAccessToken(newTokens.accessToken) as IDecodedToken;
        if (decoded?.id && decoded.role === "mentor") {
          req.mentor = decoded;
          return next();
        }

        clearTokensWithoutResponse(res);
        return sendResponse(res, StatusCode.FORBIDDEN, Messages.COMMON.ACCESS_DENIED, false);
      } catch {
        clearTokensWithoutResponse(res);
        return sendResponse(res, StatusCode.UNAUTHORIZED, Messages.AUTH.INVALID_TOKEN, false);
      }
    }

    if (error instanceof JsonWebTokenError) {
      clearTokensWithoutResponse(res);
      return sendResponse(res, StatusCode.UNAUTHORIZED, Messages.AUTH.INVALID_TOKEN, false);
    }

    return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, Messages.COMMON.INTERNAL_ERROR, false);
  }
};
