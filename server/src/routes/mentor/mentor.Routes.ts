import express from "express";
import m_authController from "../../controllers/mentor/m_auth.Controller";
import mentorController from "../../controllers/mentor/mentor.controller";
import verifyMentor from "../../middlewares/mentorVerify";
const route = express.Router();
route.post("/signup", m_authController.signupController);
route.post("/otp", m_authController.mentorOtpControler);
route.post("/otp/verify", m_authController.verifyOtp);
route.post("/login", m_authController.login);
route.post("/logout",m_authController.logout)
route.get("/get-mentor",verifyMentor,mentorController.getMentor)

export default route