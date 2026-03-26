import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Next.js 16 deprecates the `middleware.ts` file convention in favor of `proxy.ts`.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!req.auth) {
      const url = new URL("/admin/login", req.nextUrl.origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};

