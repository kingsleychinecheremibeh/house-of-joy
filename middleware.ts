// middleware.ts
// Protects /admin and /api/fabrics/* routes at the edge level

import { NextRequest, NextResponse } from "next/server";

// Routes that require login
const PROTECTED_API = [
  "/api/fabrics",
  "/api/media",
  "/api/auth/logout",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if this is a protected API route (POST, PUT, DELETE)
  const isProtectedApi = PROTECTED_API.some((p) => pathname.startsWith(p));
  const isMutating = ["POST", "PUT", "DELETE"].includes(req.method);

  if (isProtectedApi && isMutating) {
    // Check for session cookie — if missing, reject immediately
    const sessionCookie = req.cookies.get("house-of-joy-admin");
    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: "Not authorised" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/fabrics/:path*",
    "/api/media/:path*",
    "/api/auth/logout",
  ],
};
