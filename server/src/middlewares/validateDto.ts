import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCode } from "../enums/statusCode.enum";
import { sendResponse } from "../utils/resAndError";

export function validateDto<T extends object>(dtoClass: new () => T): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const message = errors
        .map((err:ValidationError) => Object.values(err.constraints || {}))
        .flat()
        .join(", ");
      return sendResponse(res, StatusCode.BAD_REQUEST, message, false);
    }

    req.body = dtoObject;
    next();
  };
}
