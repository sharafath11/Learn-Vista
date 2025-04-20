import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'yourAccessSecret';
const REFRESH_KEY = process.env.REFRESH_SECRET || 'yourRefreshSecret';
const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';
export interface TokenPayload {
  id: string;
  role: string;
}
export const generateAccessToken = (id: string, role: string): string => {
  const payload: TokenPayload = { id, role };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_EXPIRES_IN });
};
export const generateRefreshToken = (id: string, role: string): string => {
  const payload: TokenPayload = { id, role };
  return jwt.sign(payload, REFRESH_KEY, { expiresIn: REFRESH_EXPIRES_IN });
};
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, REFRESH_KEY) as TokenPayload;
  } catch (error) {
    return null;
  }
};
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as TokenPayload | null;
    return decoded;
  } catch (error) {
    return null;
  }
};
