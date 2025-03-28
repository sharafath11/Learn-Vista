import express from "express";
import authController from "../../controllers/authController";
const route = express.Router();
route.post("/signup", (req, res) => authController.signup(req, res))
route.post("/login",(req,res)=>authController.login(req,res))
export default route