import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getJwtSecret,
} from "../../../lib/authCookie";

/** Establish httpOnly session from a token already returned by the API (e.g. signup). */
export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json(
        { success: false, message: "accessToken is required" },
        { status: 400 }
      );
    }

    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(accessToken, secret);

    const response = NextResponse.json({
      success: true,
      message: "Session established",
      data: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, accessToken, getAuthCookieOptions());
    return response;
  } catch (error) {
    console.error("Auth establish error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
