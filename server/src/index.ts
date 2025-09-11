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
import sharedRoutes from "./routes/shared/shared.Routes"
import { requestLogger } from "./middlewares/requestLogger";
import { logger } from "./utils/logger";
import { CustomError } from "./types/errorTypes";
import { StatusCode } from "./enums/statusCode.enum";
import { sendResponse } from "./utils/resAndError";
import { Messages } from "./constants/messages";
import globalLimiter from "./middlewares/rateLimiter";
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
app.use(globalLimiter)
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
  sendResponse(res,StatusCode.INTERNAL_SERVER_ERROR,Messages.COMMON.INTERNAL_ERROR,true)
});
const PORT = process.env.PORT || 4000;
connectDb();
httpServer.listen(PORT, () => {
  logger.info(Messages.CONFIG.RUN(PORT));
});
