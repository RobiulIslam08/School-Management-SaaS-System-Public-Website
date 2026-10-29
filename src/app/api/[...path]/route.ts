import { NextRequest, NextResponse } from "next/server";
import { apiOrigin } from "@/lib/origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const HOP_BY_HOP = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

const MAX_REDIRECTS = 5;

function copyRequestHeaders(req: NextRequest): Headers {
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase()) && key.toLowerCase() !== "accept-encoding") {
      headers.set(key, value);
    }
  });
  headers.set("accept-encoding", "identity");
  return headers;
}

async function fetchUpstream(
  url: string,
  init: RequestInit,
  allowedOrigin: string,
): Promise<Response | NextResponse> {
  let current = url;
  let method = init.method ?? "GET";
  let body = init.body;
  const headers = new Headers(init.headers);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    let upstream: Response;
    try {
      upstream = await fetch(current, {
        method,
        headers,
        body: method === "GET" || method === "HEAD" ? undefined : body,
        redirect: "manual",
      });
    } catch {
      return NextResponse.json(
        { success: false, data: null, message: "API server is unreachable.", errors: null },
        { status: 502 },
      );
    }

    if (upstream.status < 300 || upstream.status >= 400) {
      return upstream;
    }

    const location = upstream.headers.get("location");
    if (!location) {
      return NextResponse.json(
        { success: false, data: null, message: "API server returned a redirect without Location.", errors: null },
        { status: 502 },
      );
    }

    let nextUrl: URL;
    try {
      nextUrl = new URL(location, current);
    } catch {
      return NextResponse.json(
        { success: false, data: null, message: "API server returned an invalid redirect.", errors: null },
        { status: 502 },
      );
    }

    if (nextUrl.origin !== allowedOrigin) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message:
            "API_PROXY_URL redirected to another host. Use the internal Docker service URL, not the public api domain.",
          errors: null,
        },
        { status: 502 },
      );
    }

    current = nextUrl.toString();
    if (upstream.status === 303 || ((upstream.status === 301 || upstream.status === 302) && method !== "GET" && method !== "HEAD")) {
      method = "GET";
      body = undefined;
    }
  }

  return NextResponse.json(
    { success: false, data: null, message: "API server redirect loop. Check API_PROXY_URL.", errors: null },
    { status: 502 },
  );
}

async function proxy(req: NextRequest, context: { params: Promise<{ path: string[] }> }): Promise<NextResponse> {
  const { path } = await context.params;
  const origin = apiOrigin();
  const target = `${origin}/api/${path.join("/")}${req.nextUrl.search}`;
  const method = req.method;
  const hasBody = method !== "GET" && method !== "HEAD";
  const headers = copyRequestHeaders(req);

  let allowedOrigin: string;
  try {
    allowedOrigin = new URL(origin).origin;
  } catch {
    return NextResponse.json(
      { success: false, data: null, message: "API_PROXY_URL is invalid.", errors: null },
      { status: 502 },
    );
  }

  const result = await fetchUpstream(
    target,
    {
      method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
    },
    allowedOrigin,
  );

  if (result instanceof NextResponse) return result;

  if (result.status >= 300 && result.status < 400) {
    return NextResponse.json(
      { success: false, data: null, message: "API server redirected; check API_PROXY_URL.", errors: null },
      { status: 502 },
    );
  }

  const out = new Headers();
  result.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "location" || HOP_BY_HOP.has(lower)) return;
    out.append(key, value);
  });
  out.set("Cache-Control", method === "GET" ? "private, max-age=0, must-revalidate" : "no-store, no-cache, must-revalidate, proxy-revalidate");
  out.delete("content-encoding");
  out.delete("content-length");
  return new NextResponse(await result.arrayBuffer(), { status: result.status, headers: out });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;
