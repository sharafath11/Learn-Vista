import { Request, Response } from "express";
import AdminUsersServices from "../../services/admin/users.service"

class AdminUsersController {
  async getAllUsers(req: Request, res: Response) {
    try {
    
      const result = await AdminUsersServices.getAllUsers();
      res.json(result);
    } catch (error: any) {
      console.log(error.message)
      res.status(400).json({ ok: false, msg: error.message });
    }
  }
  async userBlock(req: Request, res: Response) {
    try {
      const { id, status } = req.body;
      console.log(req.body)
      if (!id || typeof status !== "boolean") {
        res.status(400).json({ ok: false, msg: "Invalid request" });
        return
      }
  
      const result = await AdminUsersServices.blockUserServices(id, status);
      res.status(200).json(result);
      return
    } catch (error) {
      console.error("Error in userBlock controller:", error);
       res.status(500).json({ ok: false, msg: "Something went wrong" });
       return
    }
  }
  
}

export default new AdminUsersController();
