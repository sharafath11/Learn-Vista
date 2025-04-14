import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
const ACCESS_SECRET = process.env.JWT_SECRET || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export const generateTokens = (user: { id: string; role: string }) => {
  const accessToken = jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};
