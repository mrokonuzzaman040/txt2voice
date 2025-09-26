import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Session cleared successfully' });
    
    // Clear all NextAuth related cookies
    const cookieNames = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.csrf-token',
      '__Secure-next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
    ];

    // Clear each cookie by setting it to expire
    cookieNames.forEach(cookieName => {
      response.cookies.set({
        name: cookieName,
        value: '',
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    });

    return response;
  } catch (error) {
    console.error('Error clearing session:', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST(); // Allow GET requests too for easy browser access
}