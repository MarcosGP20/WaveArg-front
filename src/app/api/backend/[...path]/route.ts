import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE =
  process.env.INTERNAL_API_BASE ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://localhost:5075/api";

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
  const token = req.cookies.get("auth-token")?.value;

  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);
  if (token) headers.set("authorization", `Bearer ${token}`);

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
