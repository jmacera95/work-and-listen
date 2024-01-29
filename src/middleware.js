import { NextResponse } from 'next/server'
 
import { verifyToken } from './lib/utils';

// This function can be marked `async` if using `await` inside
export async function middleware(req) {
  const token = req ? req.cookies?.get("token")?.value : null;
  const userId = await verifyToken(token);
  const { pathname } = req.nextUrl;

  if (
    (userId && token) ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  }

  if ((!token || !userId)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|/login).*)',
  ],
}