import express from "express";
import authController from "../../controllers/authController";
import { authenticateToken } from "../../middlewares/authenticateToken";

const route = express.Router();
route.post("/signup", (req, res) => authController.signup(req, res));
route.post("/otp", (req, res) => authController.sendOtp(req, res));
route.post("/otp-verify", (req, res) => authController.verifyOtp(req, res));
route.post("/login", (req, res) => authController.login(req, res));
route.post("/logout", (req, res) => authController.logout(req, res));
route.get("/get-user", authenticateToken, (req, res) => authController.getUser(req, res));
export default route;
