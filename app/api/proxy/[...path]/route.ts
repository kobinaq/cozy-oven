import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  getBackendApiBaseUrl,
} from "../../../lib/authCookie";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "cookie",
  "content-length",
  // Node fetch decompresses the body; never forward these or the browser
  // will try to decode already-plain bytes (ERR_CONTENT_DECODING_FAILED).
  "content-encoding",
  "accept-encoding",
]);

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[]
) {
  const backendBase = getBackendApiBaseUrl();
  const path = pathSegments.join("/");
  const search = request.nextUrl.search;
  const targetUrl = `${backendBase}/${path}${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // Ask the backend for an uncompressed body so Content-Encoding stays honest.
  headers.set("Accept-Encoding", "identity");

  const incomingAuth = request.headers.get("authorization");
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (incomingAuth) {
    headers.set("Authorization", incomingAuth);
  } else if (cookieToken) {
    headers.set("Authorization", `Bearer ${cookieToken}`);
  }

  const method = request.method.toUpperCase();
  const init: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };

  if (method !== "GET" && method !== "HEAD") {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      init.body = await request.arrayBuffer();
      // Let fetch set boundary — remove our content-type so undici regenerates? 
      // Actually for forwarding, keep the original content-type with boundary.
    } else {
      const bodyText = await request.text();
      if (bodyText) init.body = bodyText;
    }
  }

  const backendRes = await fetch(targetUrl, init);
  const responseHeaders = new Headers();
  backendRes.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP.has(lower) || lower === "set-cookie") return;
    responseHeaders.set(key, value);
  });
  // Belt-and-suspenders: body from fetch is already decoded.
  responseHeaders.delete("content-encoding");

  const buffer = await backendRes.arrayBuffer();
  return new NextResponse(buffer, {
    status: backendRes.status,
    statusText: backendRes.statusText,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}
