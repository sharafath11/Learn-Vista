import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import AdminUsersServices from "../../services/admin/AdminUsers.Service";

@injectable()
export class AdminUserController {
  static getAllUsers: any;
  static userBlock(arg0: string, verifyAdmin: (req: Request, res: Response, next: NextFunction) => void, userBlock: any) {
      throw new Error("Method not implemented.");
  }
  constructor(
    @inject(TYPES.AdminUsersService)
    private adminUsersServices: AdminUsersServices
  ) {}

  async getAllUsers(req: Request, res: Response) {
    try {
      const result = await this.adminUsersServices.getAllUsers();
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
  
      const result = await this.adminUsersServices.blockUserServices(id, status);
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