import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db";
import userRoutes from "./routes/userRoutes/user.Routes"
import cookieParser from "cookie-parser"
import mentorRoutes from "./routes/mentor/mentor.Routes"
import adminRoutes from "../src/routes/adminRoutes/admin.Routes"
dotenv.config();
const app = express();
app.use(express.json());
app.use(
    cors({
    origin: 'http://localhost:3000',
      credentials: true,
    })
  );
app.use(cookieParser());
app.use("/", userRoutes);
app.use("/mentor", mentorRoutes);
app.use("/admin",adminRoutes)
const PORT = process.env.PORT || 4000;
connectDb();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
