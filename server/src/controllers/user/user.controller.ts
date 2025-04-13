import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { IUserController } from "../../core/interfaces/controllers/user/IUserController";
import { ISafeUser } from "../../types/userTypes";
import { Request, Response } from "express";
import { decodeToken } from "../../utils/tokenDecode";

export class UserController implements IUserController {
    constructor(
        @inject(TYPES.UserService) private userService: IUserService
    ) {}

    async getUser(req: Request, res: Response): Promise<void> {
        try {
           
            if (!req.cookies?.token) {
                
                res.status(401).json({ ok: false, message: "Authentication token missing" });
                return;
            }
            const decoded = decodeToken(req.cookies.token);
            console.log("jjj",decoded)
            if (!decoded?.id) {
                res.status(401).json({ ok: false, message: "Invalid or expired token" });
                return;
            }
            const user = await this.userService.getUser(decoded.id);
            if (!user) {
                res.status(404).json({ ok: false, message: "User not found" });
                return;
            }
            res.status(200).json({ ok: true, message: "Success", user });
            return 
        } catch (error:any) {
            console.error("UserController.getUser error:", error);
            res.status(500).json({ ok: false, message: error.message });
        }
    }
}