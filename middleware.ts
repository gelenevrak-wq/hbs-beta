import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("hbs-user-role")?.value;
  const email = request.cookies.get("hbs-user-email")?.value;
  const { pathname } = request.nextUrl;

  // 1. Guard all dashboard subroutes
  if (pathname.startsWith("/dashboard")) {
    if (!email || !role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Guard platform administration route
    if (pathname.startsWith("/dashboard/admin") && role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
