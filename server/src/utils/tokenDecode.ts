import jwt from "jsonwebtoken";
export const decodeToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error:any) {
    console.error("Invalid token:", error.message);
    return null;
  }
};
