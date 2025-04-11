import jwt from 'jsonwebtoken';

export interface DecodedToken extends jwt.JwtPayload {
  id: string;
  role: 'admin' | 'user' | 'mentor';
}

export const decodeToken = (token: string): DecodedToken => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === 'string' || !decoded) {
      throw new Error('Invalid token format');
    }
    return decoded as DecodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};