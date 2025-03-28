import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db";
import userRoutes from "../src/routes/userRoutes/authRoutes"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", userRoutes);
const PORT = process.env.PORT || 4000;
connectDb();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
