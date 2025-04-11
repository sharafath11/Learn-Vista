import express from "express";
import AdminAuthController from "../../controllers/admin/AdminAuth.Controller";
import AdminUserController from "../../controllers/admin/AdminUser.Controller";
import verifyAdmin from "../../middlewares/authVerifyAdmin";
import AdminMentorController from "../../controllers/admin/AdminMentor.Controller";
import container from "../../core/di/container";
import { TYPES } from "../../core/types";

const route = express.Router();

const adminMentorController = container.get<AdminMentorController>(TYPES.AdminMentorController);
const adminUsersController = container.get<AdminUserController>(TYPES.AdminUserController); // ✅ fixed

// Auth routes
route.post("/login", AdminAuthController.login);
route.post("/logout", verifyAdmin, AdminAuthController.adminLogout);

// User management routes
route.get("/users", verifyAdmin, adminUsersController.getAllUsers.bind(adminUsersController));
route.patch("/users/block", verifyAdmin, adminUsersController.userBlock.bind(adminUsersController));

// Mentor management routes
route.get("/mentors", verifyAdmin, adminMentorController.getAllMentors.bind(adminMentorController));
route.patch("/mentors/status", verifyAdmin, adminMentorController.changeStatus.bind(adminMentorController));
route.patch("/mentors/block", verifyAdmin, adminMentorController.blockMentor.bind(adminMentorController));

export default route;
