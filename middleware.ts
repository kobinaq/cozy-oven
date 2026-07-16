import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE_NAME } from "./app/lib/authCookie";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password"];

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.AUTH_JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || "";
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPublic = PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAdminRoute = pathname.startsWith("/admin");
  const isAccountRoute = pathname.startsWith("/account");

  if (isAdminRoute && isAdminPublic) {
    return NextResponse.next();
  }

  if (!isAdminRoute && !isAccountRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = isAdminRoute
      ? new URL("/admin/login", request.url)
      : new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = getJwtSecret();
    if (!secret.length) {
      throw new Error("Missing AUTH_JWT_SECRET");
    }
    const { payload } = await jwtVerify(token, secret);

    if (isAdminRoute && payload.role !== "Admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = isAdminRoute
      ? new URL("/admin/login", request.url)
      : new URL("/", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
