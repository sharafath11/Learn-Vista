import express from 'express';
import { TYPES } from '../../core/types';
import { verifyMentor } from '../../middlewares/mentorVerify';
import { IMentorController } from '../../core/interfaces/controllers/mentor/IMentor.Controller';
import { IMentorAuthController } from '../../core/interfaces/controllers/mentor/IMentorAuth.Controller';
import container from '../../core/di/container';
import { IMentorProfileController } from '../../core/interfaces/controllers/mentor/IMentorProfile.controller';
import upload, { uploadImage } from '../../middlewares/upload';
const router = express.Router();
const mentorAuthController = container.get<IMentorAuthController>(TYPES.MentorAuthController);
const mentorController = container.get<IMentorController>(TYPES.MentorController);
const mentorProfileController=container.get<IMentorProfileController>(TYPES.MentorProfileController)
// Auth Routes
router.post('/signup', (req, res) => mentorAuthController.signupController(req, res));
router.post('/send-otp', (req, res) => mentorAuthController.mentorOtpControler(req, res));
router.post('/otp/verify', (req, res) => mentorAuthController.verifyOtp(req, res));
router.post('/login', (req, res) => mentorAuthController.login(req, res));
router.post('/logout', (req, res) => mentorAuthController.logout(req, res));

// Protected Routes
router.post("/edit-profile",uploadImage.single('image'),verifyMentor,(req,res)=>mentorProfileController.editProfile(req,res))
router.get('/get-mentor', verifyMentor, (req, res, next) => {
    mentorController.getMentor(req, res).catch(next);
});
router.post("/forget-password", (req, res) => mentorAuthController.forgetPassword(req, res));
router.post("/reset-password",(req,res)=>mentorAuthController.restartPassword(req,res))

export default router;