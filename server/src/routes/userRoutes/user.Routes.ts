// src/routes/userRoutes/user.Routes.ts
import express from "express";

import { authenticateToken } from "../../middlewares/authenticateToken";
import upload from "../../middlewares/upload";
import AuthController from "../../controllers/user/auth.controller";
import container from "../../core/di/container";
import { ProfileController } from "../../controllers/user/profile.controller";
import { TYPES } from "../../core/types";

const router = express.Router();

// Get instances from DI container
const authController = container.get<AuthController>(TYPES.AuthController);
const profileController = container.get<ProfileController>(TYPES.ProfileController);

// Auth Routes
router.post("/signup", (req, res) => authController.signup(req, res));
router.post("/google/signup", (req, res) => authController.googleAuth(req, res));
router.post("/otp", (req, res) => authController.sendOtp(req, res));
router.post("/otp-verify", (req, res) => authController.verifyOtp(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));
router.get("/get-user", authenticateToken, (req, res) => authController.getUser(req, res));

// Profile Routes
router.post("/apply-mentor", authenticateToken, upload.single("cv"), 
    (req, res) => profileController.applyMentor(req, res)
);

export default router;