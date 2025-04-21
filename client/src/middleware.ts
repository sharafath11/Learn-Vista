// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  const publicRoutes = ["/user/login", "/mentor/login", "/admin/login"];
  if (publicRoutes.includes(path)) return NextResponse.next();

  // ✅ Only check if token exists
  if (!token) {
    const redirectMap: { [key: string]: string } = {
      "/user": "/user/login",
      "/mentor": "/mentor/login",
      "/admin": "/admin/login",
    };

    for (const key in redirectMap) {
      if (path.startsWith(key)) {
        return NextResponse.redirect(new URL(redirectMap[key], req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/mentor/:path*", "/admin/:path*"],
};
