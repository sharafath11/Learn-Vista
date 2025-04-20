import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Single token for all roles
  const currentPath = req.nextUrl.pathname;

  // Define routes for each role
  const userRoutes = ["/user/profile", "/user/dashboard"];
  const mentorRoutes = ["/mentor/home", "/mentor/profile"];
  const adminRoutes = ["/admin/dashboard", "/admin/settings"];

  // Helper function to verify token and role
  const verifyTokenRole = (token: string | undefined, expectedRoles: string[]): boolean => {
    if (!token) return false;
    try {
      const decoded: any = jwt.verify(token, SECRET);
      // Check if the decoded role matches any of the expected roles
      return expectedRoles.includes(decoded.role);
    } catch (err) {
      console.error("Token verification error:", err);
      return false;
    }
  };

  // Check for the role and protect routes based on the role
  if (userRoutes.some(route => currentPath.startsWith(route))) {
    if (!verifyTokenRole(token, ["user"])) {
      return NextResponse.redirect(new URL("/user/login", req.url));
    }
  }

  if (mentorRoutes.some(route => currentPath.startsWith(route))) {
    if (!verifyTokenRole(token, ["mentor"])) {
      return NextResponse.redirect(new URL("/mentor/login", req.url));
    }
  }

  if (adminRoutes.some(route => currentPath.startsWith(route))) {
    if (!verifyTokenRole(token, ["admin"])) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/mentor/:path*",
    "/admin/:path*"
  ],
};
