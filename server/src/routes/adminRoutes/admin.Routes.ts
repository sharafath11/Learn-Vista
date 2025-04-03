import express from "express";
import AdminAuthController from "../../controllers/admin/AdminAuthController";
const route = express.Router();
route.post("/login", AdminAuthController.login)
export default route