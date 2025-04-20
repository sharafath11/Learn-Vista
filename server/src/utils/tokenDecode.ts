import jwt from 'jsonwebtoken';
export interface AuthTokenPayload {
  id: string;
  role: 'admin' | 'user' | 'mentor';
}
export interface DecodedToken extends AuthTokenPayload, jwt.JwtPayload {
  iat: number;
  exp: number;
}

export const decodeToken = (token: string): DecodedToken => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret not configured');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
  if (!decoded.userId || !decoded.role) {
    console.error('Invalid token payload:', decoded);
    throw new Error('Token missing required fields');
  }

  return decoded;
};

export const mentorDecodeToken = (token: string): DecodedToken => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret not configured');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
  if (!decoded.mentorId || !decoded.role) {
    console.error('Invalid token payload:', decoded);
    throw new Error('Token missing required fields');
  }

  return decoded;
};