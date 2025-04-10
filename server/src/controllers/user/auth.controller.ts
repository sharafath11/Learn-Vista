import { Request, Response } from "express";
import authService from "../../services/user/auth.service";
import { AuthenticatedRequest } from "../../types/userTypes";
import { handleGoogleSignup } from "../../utils/googleAuth";
import { generateTokens } from "../../utils/generateToken";
import jwt from "jsonwebtoken"

class AuthController {
    async signup(req: Request, res: Response) {
        try {
            console.log("body",req.body)
            await authService.registerUser(req.body);
            res.status(201).json({ ok: true, msg: "User registration successful" });
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async sendOtp(req: Request, res: Response) {
        try {
            await authService.sendOtp(req.body.email);
            res.status(200).json({ ok: true, msg: `OTP sent to ${req.body.email}` });
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            await authService.verifyOtp(req.body.email, req.body.otp);
            res.status(200).json({ ok: true, msg: "Verification successful" });
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async login(req: Request, res: Response) {
        try {
          const { email, password,googleId } = req.body;
          const { token, refreshToken, user } = await authService.loginUser(email, password,googleId as string);
      
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000, 
          });
      
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
          });
        
          res.status(200).json({ ok: true, msg: "Login successful", token, refreshToken, user });
        } catch (error: any) {
          console.error("Login error:", error.message);
          res.status(401).json({ ok: false, msg: error.message });
        }
    }
    async googleAuth(req: Request, res: Response) {
        try {
            const result = await handleGoogleSignup(req.body);
            const token = jwt.sign(
                { 
                  role: "user", 
                  userId: result.user._id,
                  email: result.user.email
                },
                process.env.JWT_SECRET as string,
                { expiresIn: "15m" } // Short-lived access token
              );
          
              const refreshToken = jwt.sign(
                { userId: result.user._id },
                process.env.REFRESH_SECRET as string,
                { expiresIn: "7d" }
              );
              
              // 4. Set HTTP-only cookies
              res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000, // 15 minutes
                path: "/",
              });
              
              res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: "/"
              });         
            res.status(200).json({
                ok: true,
                msg: "Google authentication successful",
                user: result.user,
            });
        } catch (error: any) {
            console.error("Google Auth Error:", error);
            res.status(500).json({
                ok: false,
                msg: error.message || "Google authentication failed"
            });
        }
    }
      
    logout (req: Request, res: Response) {
       try {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        res.status(200).json({ ok: true, msg: "Logged out successfully" });
       } catch (error) {
       this.handleError(res,error)
       }
      }


    async getUser(req: AuthenticatedRequest, res: Response) {
        
        try {
            
            if (!req.cookies.token) {
                throw new Error("User not valid");
            }
        
            
            const user = await authService.getUser(req.cookies.token);
            res.status(200).json({ok:true,msg:"",user});
        } catch (error: any) {
            res.status(500).json({ msg: error.message });
        }
    }

    private handleError(res: Response, error: any) {
        res.status(400).json({ ok: false, msg: error.message });
    }
}

export default new AuthController();
