import { NextResponse, NextRequest } from "next/server";
import { getLoggedInInfo } from "@/utils/cookies";

export function middleware(request: NextRequest) {
  let token = getLoggedInInfo();
  const currPath = request.nextUrl.pathname;
  if (!token && currPath !== "/login") {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (token && currPath === "/login") {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/chat", "/login"],
};
