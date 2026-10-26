import { NextResponse } from 'next/server';
import { getAdminSecret, generateToken } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = typeof body.password === 'string' ? body.password.trim() : '';

    const validPassword = getAdminSecret();

    if (password !== validPassword) {
      return NextResponse.json({ error: 'Incorrect passcode.' }, { status: 401 });
    }

    const token = generateToken();
    const res = NextResponse.json({ success: true, token });

    // Set HTTP-only cookie for secure browser access
    res.cookies.set('cc_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, loggedOut: true });
  res.cookies.set('cc_admin_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return res;
}
