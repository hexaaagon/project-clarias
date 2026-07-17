import type { NextRequest, ProxyConfig } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/home", "/auth", "/api"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get("clarias-auth");

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // Allow static assets and public paths through
  if (
    isPublic ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Unauthenticated users get redirected to /home
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|static|.*\\..*).*)"],
};
