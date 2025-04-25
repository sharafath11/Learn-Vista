import { Response } from "express";

export function throwError(err: string) {
    console.error("Throwing error:", err);
    throw new Error(err);
    
}

export function sendResponse(res: Response,status: number, msg: string,  ok: boolean,data?:any) {
    console.error(msg);
    res.status(status).json({ ok, msg ,data});
}
export function handleControllerError(res: Response, error: unknown, statusCode = 400): void {
  const err = error as Error;
  console.error(err.message);
  sendResponse(res, statusCode, err.message, false);
}
