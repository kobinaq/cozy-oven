import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  getAccessTokenFromCookies,
  getBackendApiBaseUrl,
  getJwtSecret,
} from "../../lib/authCookie";

export async function GET() {
  try {
    const token = await getAccessTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret);

    // Prefer live profile from API when possible
    try {
      const profileRes = await fetch(
        `${getBackendApiBaseUrl()}/api/v1/status/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );
      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile?.data || profile?.user) {
          return NextResponse.json({
            success: true,
            data: profile.data || profile.user,
          });
        }
      }
    } catch {
      // fall through to JWT claims
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: payload.userId,
        email: payload.email,
        role: payload.role,
        fullName: payload.fullName || "",
        phoneNumber: payload.phoneNumber || "",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid session" },
      { status: 401 }
    );
  }
}
