import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = '7d'; // Access token expires in 7 days
const REFRESH_TOKEN_EXPIRES_IN = '30d'; // Refresh token expires in 30 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'client' | 'admin' | 'trainer';
  clientId?: string;
}

// Get JWT secret - checks at runtime instead of module load time
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable must be set!');
  }
  return secret;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJWTSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJWTSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, getJWTSecret());
    if (typeof decoded === 'object' && decoded !== null) {
      return decoded as JWTPayload;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
