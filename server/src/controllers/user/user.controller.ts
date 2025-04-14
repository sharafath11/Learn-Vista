import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { IUserController } from "../../core/interfaces/controllers/user/IUserController";
import { ISafeUser } from "../../types/userTypes";
import { Request, Response } from "express";

export class UserController implements IUserController {
    constructor(
        @inject(TYPES.UserService) private userService: IUserService
    ) {}

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.userService.getUser(req.user?.id as string);
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