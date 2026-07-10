import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.secret as any, {
    expiresIn: config.jwt.expire,
  } as any) as string;
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret as any, {
    expiresIn: config.jwt.refreshExpire,
  } as any) as string;
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.secret as any) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret as any) as TokenPayload;
}

export function decodeToken(token: string): any {
  return jwt.decode(token);
}
