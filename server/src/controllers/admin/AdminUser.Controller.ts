import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";

import { IAdminUserServices } from "../../core/interfaces/services/admin/IAdminUserServices";
import { IAdminUserController } from "../../core/interfaces/controllers/admin/IAdminUser.controller";

@injectable()
export class AdminUserController implements IAdminUserController{
  constructor(
     @inject(TYPES.AdminUsersService) private adminUserService: IAdminUserServices
   ) {}
  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await this.adminUserService.getAllUsers()
      res.json(result);
    } catch (error: any) {
      console.error("Error in getAllUsers:", error.message);
      res.status(500).json({ ok: false, msg: error.message });
    }
  }

  async userBlock(req: Request, res: Response) {
    try {
      const { id, status } = req.body;
      if (!id || typeof status !== "boolean") {
         res.status(400).json({ ok: false, msg: "Invalid request" });
         return
      }
  
      const result = await this.adminUserService.blockUserServices(id, status);
       res.status(200).json(result);
       return
    } catch (error: any) {
      console.error("Error in userBlock:", error.message);
       res.status(500).json({ ok: false, msg: error.message });
       return
    }
  }
}

export default AdminUserController;