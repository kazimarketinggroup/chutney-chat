import crypto from 'crypto';

export function getAdminSecret(): string {
  return process.env.ADMIN_PASSWORD || 'ChutneyAdmin2026!';
}

export function generateToken(): string {
  const secret = getAdminSecret();
  return crypto.createHmac('sha256', secret).update(`cc-admin-${secret}`).digest('hex');
}

export function isValidToken(token: string | null | undefined): boolean {
  if (!token) return false;
  return token === generateToken();
}
