import jwt from 'jsonwebtoken';

export interface DecodedToken extends jwt.JwtPayload {
  id?: string;       // Make optional since your current tokens don't have it
  email: string;     // Add this to match your actual tokens
  role: 'admin' | 'user' | 'mentor';
  iat: number;       // Issued at
  exp: number;       // Expiration time
}

export const decodeToken = (token: string): DecodedToken => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    if (typeof decoded === 'string' || !decoded) {
      throw new Error('Invalid token format');
    }
    
    // Type guard to ensure required fields exist
    const tokenData = decoded as DecodedToken;
    if (!tokenData.email || !tokenData.role) {
      throw new Error('Missing required token fields');
    }
    
    return tokenData;
  } catch (error) {
    throw new Error('Invalid token');
  }
};