import express from "express";
import authController from "../../controllers/authController";
const route = express.Router();
route.post("/signup", (req, res) => authController.signup(req, res));
route.post("/otp", (req, res) => authController.otpSend(req, res))
route.post("/otp-verify",(req, res) => authController.otpVerifyController(req, res))
route.post("/login", (req, res) => authController.login(req, res));
route.post("/get-user", authController.getUser.bind(authController))
export default route