import { Response as ExpressResponse } from "express";

export function throwError(err: string) {
    console.error("Throwing error:", err);
    throw new Error(err);
    
}

export function sendResponse(res: ExpressResponse,status: number, msg: string,  ok: boolean,data?:any) {
    console.error(msg);
    res.status(status).json({ ok, msg ,data});
}
