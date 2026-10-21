import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { BACKEND_API_BASE } from "@/lib/backend";

// El backend ve todas las requests de este proxy con la IP de Vercel. Para que su rate limit
// distinga usuarios, le pasamos la IP del navegador junto con un secreto compartido
// (Proxy:ClientIpSecret en el backend); sin el secreto, el backend ignora el header.
const BACKEND_PROXY_SECRET = process.env.BACKEND_PROXY_SECRET;

// En Vercel, x-real-ip y el primer valor de x-forwarded-for los pone la plataforma.
function getClientIp(req: NextRequest): string | null {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null
  );
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyRequest(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const backendUrl = new URL(`${BACKEND_API_BASE}/${path.join("/")}`);
  backendUrl.search = req.nextUrl.search;

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  const accept = req.headers.get("accept");
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const clientIp = getClientIp(req);

  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);
  if (token) headers.set("authorization", `Bearer ${token}`);
  if (BACKEND_PROXY_SECRET && clientIp) {
    headers.set("x-wave-client-ip", clientIp);
    headers.set("x-wave-proxy-secret", BACKEND_PROXY_SECRET);
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  const backendResponse = await fetch(backendUrl, init);
  const responseHeaders = new Headers();
  const responseContentType = backendResponse.headers.get("content-type");

  if (responseContentType) {
    responseHeaders.set("content-type", responseContentType);
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function POST(req: NextRequest, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return proxyRequest(req, context);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return proxyRequest(req, context);
}
