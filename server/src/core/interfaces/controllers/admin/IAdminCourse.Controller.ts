import { Request,Response } from "express";

export interface IAdminCourseController {
    createClass(req:Request,res:Response):void
}