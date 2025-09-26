import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) {
          return false;
        }

        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token.role === 'ADMIN';
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/transcriptions/:path*'],
};
