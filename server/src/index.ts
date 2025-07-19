import express, { Request, response, Response } from "express";
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
import { socketHandler } from "./config/ socket";
import { getGemaniResponse } from "./config/gemaniAi";
import { handleControllerError, sendResponse } from "./utils/ResANDError";
import { StatusCode } from "./enums/statusCode.enum";
import { batmanPrompt } from "./utils/Rportprompt";
import { setIOInstance } from "./config/globalSocket";
import sharedRoutes from "../src/routes/shared/shared.Routes"
import { requestLogger } from "./middlewares/requestLogger";
import { logger } from "./utils/logger";
dotenv.config();

const app = express();
const httpServer = createServer(app); 
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
});
socketHandler(io);
setIOInstance(io);
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(cookieParser());
app.use("/", userRoutes);
app.use("/mentor", mentorRoutes);
app.use("/admin", adminRoutes);
app.use("/shared",sharedRoutes)
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
app.use("/ai/doubt", async (req: Request, res: Response) => {
  try {
    const prompt=batmanPrompt(req.body.text)
  const answer = await getGemaniResponse(prompt);
  sendResponse(res, StatusCode.OK, "", true, answer);
  } catch (error) {
    handleControllerError(res,error)
  }
});
app.use(requestLogger);
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, msg: "Something went wrong!" });
});

const PORT = process.env.PORT || 4000;
connectDb();
httpServer.listen(PORT, () => {
  logger.info(` Server running on port ${PORT}`);
});
