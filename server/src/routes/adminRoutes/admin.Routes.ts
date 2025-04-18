import express from "express";
import verifyAdmin from "../../middlewares/authVerifyAdmin";
import AdminMentorController from "../../controllers/admin/AdminMentor.Controller";
import container from "../../core/di/container";
import { TYPES } from "../../core/types";
import { IAdminUserController } from "../../core/interfaces/controllers/admin/IAdminUser.controller";
import { IAdminAuthController } from "../../core/interfaces/controllers/admin/IAdminAuth.Controller";
import { IAdminMentorController } from "../../core/interfaces/controllers/admin/IAdminMentor.Controller";
const route = express.Router();

const adminMentorController = container.get<IAdminMentorController>(TYPES.AdminMentorController);
const adminUsersController = container.get<IAdminUserController>(TYPES.AdminUserController); 
const adminAuthController = container.get<IAdminAuthController>(TYPES.AdminAuthController)

route.post("/login", adminAuthController.login.bind(adminAuthController));
route.post("/logout", verifyAdmin, adminAuthController.logout.bind(adminAuthController));
route.get("/users", verifyAdmin, adminUsersController.getAllUsers.bind(adminUsersController));
route.patch("/users/block", verifyAdmin, adminUsersController.userBlock.bind(adminUsersController));
route.get("/mentors", verifyAdmin, adminMentorController.getAllMentors.bind(adminMentorController));
route.get("/mentor/:id",verifyAdmin,adminMentorController.mentorDetils.bind(adminMentorController))
route.patch("/mentor/change-status", verifyAdmin, adminMentorController.changeStatus.bind(adminMentorController));
route.patch("/mentor/block", verifyAdmin, adminMentorController.blockMentor.bind(adminMentorController));

export default route;
