import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDb from "./config/db";
import userRoutes from "./routes/userRoutes/user.Routes";
import mentorRoutes from "./routes/mentor/mentor.Routes";
import adminRoutes from "./routes/adminRoutes/admin.Routes";
import { refreshAccessToken, setTokensInCookies } from "./utils/JWTtoken";
import socketHandler from "./config/ socket";

dotenv.config();

const app = express();
const httpServer = createServer(app); 
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});
socketHandler(io);
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
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
    res.status(200).json({ ok: true, msg: "Tokens refreshed successfully" });
    return
  } catch (error: any) {
    res.status(500).json({ ok: false, msg: "Failed to refresh token", error: error.message });
    return
  }
});
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, msg: "Something went wrong!" });
});

const PORT = process.env.PORT || 4000;
connectDb();
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
