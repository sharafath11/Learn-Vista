import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
 
  const userToken = req.cookies.get("token");
  const mentorToken = req.cookies.get("mentorToken");
  const adminToken = req.cookies.get("adminToken");
  console.log("gvfuhguyguigiuyergvuyewrgvervhbewhvbehiowhgbvouwerbvouhwerbvjhefbvjhiefvihjfvgbivefubhdvvhbhbjhefghewqfwefgghioefbhjfehiwefqgqh")
  const userRoutes = ["/user/profile", "/user/dashboard"];
  const mentorRoutes = ["/mentor/home", "/mentor/profile"];
  const adminRoutes = ["/admin/dashboard", "/admin/settings"];

  const currentPath = req.nextUrl.pathname;

  if (userRoutes.some(route => currentPath.startsWith(route))) {
    if (!userToken) {
      return NextResponse.redirect(new URL("/user/login", req.url));
    }
  } 
  else if (mentorRoutes.some(route => currentPath.startsWith(route))) {
    if (!mentorToken) {
      return NextResponse.redirect(new URL("/mentor/login", req.url));
    }
  } 
  else if (adminRoutes.some(route => currentPath.startsWith(route))) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }
  return NextResponse.next();
}

// Apply the middleware to all relevant routes
export const config = {
  matcher: [
    "/user/:path*", 
    "/mentor/:path*", 
    "/admin/:path*"
  ],
};
