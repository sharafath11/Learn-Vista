import express, { Router } from "express";
import AdminAuthController from "../../controllers/admin/AdminAuth.Controller";
import AdminUserController from "../../controllers/admin/AdminUser.Controller";
import verifyAdmin from "../../middlewares/authVerifyAdmin";
import AdminMentorController from "../../controllers/admin/AdminMentor.Controller";
const route = express.Router();
route.post("/login", AdminAuthController.login);
route.get("/getAllUsers", verifyAdmin, AdminUserController.getAllUsers);
route.patch("/block-user", verifyAdmin, AdminUserController.userBlock);
route.get("/get-allMentor", verifyAdmin, AdminMentorController.getAllMentors);
route.patch("/change-status", verifyAdmin, AdminMentorController.ChangeStatusMentoeController);
route.patch("/block-mentor", verifyAdmin, AdminMentorController.adminMentorBlock);
route.post("/logout",verifyAdmin,AdminAuthController.adminLogout)
export default route