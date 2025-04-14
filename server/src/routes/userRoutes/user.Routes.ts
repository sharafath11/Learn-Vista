import express from "express";
import container from "../../core/di/container";
import AuthController from "../../controllers/user/auth.controller";
import { TYPES } from "../../core/types";
import { ProfileController } from "../../controllers/user/profile.controller";
import { UserController } from "../../controllers/user/user.controller";
import { authenticateToken } from "../../middlewares/authenticateToken";
import upload from "../../middlewares/upload";

const router = express.Router();

const authController = container.get<AuthController>(TYPES.AuthController);
const profileController = container.get<ProfileController>(TYPES.ProfileController);
const userController = container.get<UserController>(TYPES.UserController);

router.post("/signup", authController.signup.bind(authController));
router.post("/google/signup", authController.googleAuth.bind(authController));
router.post("/otp", authController.sendOtp.bind(authController));
router.post("/otp-verify", authController.verifyOtp.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.get("/user", authenticateToken, userController.getUser.bind(userController));
router.post("/apply-mentor", 
  authenticateToken,
  upload.single("cv"),
  profileController.applyMentor.bind(profileController)
);

export default router;