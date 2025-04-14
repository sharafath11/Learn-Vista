import jwt from 'jsonwebtoken';

// Simplified token interface
export interface AuthTokenPayload {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'mentor';
}

// Extended JWT payload with standard fields
export interface DecodedToken extends AuthTokenPayload, jwt.JwtPayload {
  iat: number;
  exp: number;
}

export const decodeToken = (token: string): DecodedToken => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret not configured');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

  // Validate required fields
  if (!decoded.id || !decoded.email || !decoded.role) {
    console.error('Invalid token payload:', decoded);
    throw new Error('Token missing required fields');
  }

  return decoded;
};