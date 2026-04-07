import * as jose from 'jose';
import { cookies } from 'next/headers';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'default-secret-change-me-in-production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export async function createToken(): Promise<string> {
  const secret = new TextEncoder().encode(ADMIN_JWT_SECRET);
  const token = await new jose.SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  return token;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(ADMIN_JWT_SECRET);
    await jose.jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return false;
  return verifyToken(token);
}
