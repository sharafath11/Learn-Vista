import express, { NextFunction, Request,  Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDb from "./config/db";
import userRoutes from "./routes/userRoutes/user.Routes";
import mentorRoutes from "./routes/mentor/mentor.Routes";
import adminRoutes from "./routes/adminRoutes/admin.Routes";
import { socketHandler } from "./config/ socket";
import { setIOInstance } from "./config/globalSocket";
import sharedRoutes from "../src/routes/shared/shared.Routes"
import { requestLogger } from "./middlewares/requestLogger";
import { logger } from "./utils/logger";
import { CustomError } from "./types/errorTypes";
import { refreshAccessToken, setTokensInCookies } from "./utils/JWTtoken";
import { StatusCode } from "./enums/statusCode.enum";
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
app.use("/api", userRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/shared",sharedRoutes)
app.use(requestLogger);
app.use((err: CustomError, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, msg: "Something went wrong!" });
});
app.use("/api/refresh-token", (req: Request, res: Response) => {
  
});
const PORT = process.env.PORT || 4000;
connectDb();
httpServer.listen(PORT, () => {
  logger.info(` Server running on port ${PORT}`);
});
