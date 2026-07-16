import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getBackendApiBaseUrl,
  getJwtSecret,
} from "../../../lib/authCookie";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendRes = await fetch(`${getBackendApiBaseUrl()}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success || !data.accessToken) {
      return NextResponse.json(data, { status: backendRes.status || 401 });
    }

    // Ensure token is valid before setting cookie
    const secret = new TextEncoder().encode(getJwtSecret());
    await jwtVerify(data.accessToken, secret);

    const response = NextResponse.json({
      success: true,
      message: data.message || "Login successful",
      data: data.data,
    });

    response.cookies.set(
      AUTH_COOKIE_NAME,
      data.accessToken,
      getAuthCookieOptions()
    );

    return response;
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
