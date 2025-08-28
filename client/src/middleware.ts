// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
console.log("All cookies in middleware:", req.cookies.getAll());
console.log("Token cookie:", req.cookies.get("token"));
console.log("Refresh cookie:", req.cookies.get("refreshToken"));
console.log("Cookies in middleware:", req.cookies.get("token")?.value);
  const token = req.cookies.get("token")?.value || req.cookies.get("refreshToken");
  const path = req.nextUrl.pathname;
  //not checking
  const publicRoutes = [
    "/user/login", 
    "/mentor/login", 
    "/mentor/signup",
    "/mentor/forgot-password",
    "/mentor/reset-password",
    "/admin/login",
    "/user/signup",
    "/user/forgot-password",
    "/user/reset-password",
    "/api/auth",
    "/user/certificate/:certificateId"
  ];
  if (publicRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }


  const redirectMap: Record<string, string> = {
    "/user": "/user/login",
    "/mentor": "/mentor/login",
    "/admin": "/admin/login",
  };
  if (!token) {
    for (const [prefix, redirectPath] of Object.entries(redirectMap)) {
      if (path.startsWith(prefix)) {
        const url = new URL(redirectPath, req.url);
        return NextResponse.redirect(url);
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  //protected route
  matcher: [
    "/user/:path*",
    "/mentor/:path*", 
    "/admin/:path*",
   
  ],
};