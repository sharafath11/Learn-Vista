import jwt from 'jsonwebtoken';

export interface AuthTokenPayload {
  id: string;
  role: 'admin' | 'user' | 'mentor';
}

export interface DecodedToken extends AuthTokenPayload, jwt.JwtPayload {
  iat: number;
  exp: number;
}

export const AdmindecodeToken = (token: string): DecodedToken => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT secret not configured');
  }

  const decoded = verifyAndValidateToken(token, secret);
  
  if (decoded.role !== 'admin') {
    throw new Error('Access denied: Not an admin token');
  }

  return decoded;
};
const verifyAndValidateToken = (token: string, secret: string): DecodedToken => {
  const decoded = jwt.verify(token, secret) as DecodedToken;
  console.log("deeeeeeeeeeeecoded",decoded)
  if (!decoded.id || !decoded.role) {
    console.error('Invalid token payload:', decoded);
    throw new Error('Token missing required fields');
  }

  return decoded;
};
