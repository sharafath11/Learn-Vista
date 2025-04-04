import express, { Router } from "express";
import AdminAuthController from "../../controllers/admin/AdminAuthController";
import AdminUserController from "../../controllers/admin/AdminUserController";
import verifyAdmin from "../../middlewares/authVerifyAdmin";
const route = express.Router();
route.post("/login", AdminAuthController.login);
route.get("/getAllUsers", verifyAdmin, AdminUserController.getAllUsers);
route.patch("/block-user",verifyAdmin, AdminUserController.userBlock);
export default route