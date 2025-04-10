import express from "express";
// import authController from "../../controllers/user/authController";
import { authenticateToken } from "../../middlewares/authenticateToken";
import upload from "../../middlewares/upload";
import profileController from "../../controllers/user/profile.controller";
import authController from "../../controllers/user/auth.controller";

const route = express.Router();
route.post("/signup", (req, res) => authController.signup(req, res));
route.post("/google/signup",authController.googleAuth)
route.post("/otp", (req, res) => authController.sendOtp(req, res));
route.post("/otp-verify", (req, res) => authController.verifyOtp(req, res));
route.post("/login", (req, res) => authController.login(req, res));
route.post("/logout", (req, res) => authController.logout(req, res));
route.get("/get-user", authenticateToken, (req, res) => authController.getUser(req, res));
route.post("/apply-mentor",authenticateToken, upload.single("cv"), (req, res) => 
    profileController.applyMentor(req, res)
  );
export default route;
