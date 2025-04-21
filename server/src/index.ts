import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db";
import userRoutes from "./routes/userRoutes/user.Routes"
import cookieParser from "cookie-parser"
import mentorRoutes from "./routes/mentor/mentor.Routes"
import adminRoutes from "../src/routes/adminRoutes/admin.Routes"
import { refreshAccessToken, setTokensInCookies } from "./utils/JWTtoken";
dotenv.config();
const app = express();
app.use(express.json());
app.use(
    cors({
    origin: 'http://localhost:3000',
      credentials: true,
    })
);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, msg: 'Something went wrong!' });
});
app.use(cookieParser());
app.use("/", userRoutes);
app.use("/mentor", mentorRoutes);
app.use("/admin", adminRoutes);
app.use("/refresh-token", (req: Request, res: Response) => {
  try {
    const tokens = refreshAccessToken(req.cookies.refreshToken);
    
    if (!tokens) {
      res.status(401).json({ message: "Invalid refresh token" });
      return
    }

    setTokensInCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(200).json({ ok:true,msg: "Tokens refreshed successfully" });
    return
  } catch (error: any) {
    res.status(500).json({ok:true, msg: "Failed to refresh token", error: error.message });
    return
  }
})
const PORT = process.env.PORT || 4000;
connectDb();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
