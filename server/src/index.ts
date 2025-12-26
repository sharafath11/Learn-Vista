import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDb from "./config/db";
import userRoutes from "./routes/userRoutes/user.Routes";
import mentorRoutes from "./routes/mentor/mentor.Routes";
import adminRoutes from "./routes/adminRoutes/admin.Routes";
import sharedRoutes from "./routes/shared/shared.Routes";
import { socketHandler } from "./config/ socket";
import { setIOInstance } from "./config/globalSocket";
import { requestLogger } from "./middlewares/requestLogger";
import { logger } from "./utils/logger";
import { CustomError } from "./types/errorTypes";
import { StatusCode } from "./enums/statusCode.enum";
import { sendResponse } from "./utils/resAndError";
import { Messages } from "./constants/messages";
import globalLimiter from "./middlewares/rateLimiter";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

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
app.use(cookieParser());
app.use(requestLogger); // Moved up to see logs in terminal

// 4. CORS: We keep this, but we will clean up Nginx to avoid "Double Headers"
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(globalLimiter);

// 5. Routes
app.use("/api", userRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/shared", sharedRoutes);

// 6. Error Handling
app.use(
  (err: CustomError, req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    sendResponse(
      res,
      StatusCode.INTERNAL_SERVER_ERROR,
      Messages.COMMON.INTERNAL_ERROR,
      true
    );
  }
);

connectDb();

const PORT = Number(process.env.PORT) || 4000;
httpServer.listen(PORT, "0.0.0.0", () => {
  logger.info(Messages.CONFIG.RUN(PORT));
});