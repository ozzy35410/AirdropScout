import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.ADMIN_SESSION_TOKEN;
  if (!expected) return false;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return token === expected;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authorized = isAuthorized(request);

  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/session") {
      return NextResponse.next();
    }
    if (!authorized) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (authorized) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/nfts";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    if (!authorized) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
