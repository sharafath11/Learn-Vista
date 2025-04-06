import express from "express";
import m_authController from "../../controllers/mentor/m_auth.Controller";
const route = express.Router();
route.post("/signup", m_authController.signupController);
route.post("/otp", m_authController.mentorOtpControler);
route.post("/otp/verify", m_authController.verifyOtp);
route.post("/login",m_authController.login)

export default route