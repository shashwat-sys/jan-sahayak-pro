import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isClerkConfigured } from "@/lib/server/env";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/cases(.*)",
  "/activities(.*)",
  "/finance(.*)",
  "/monthly-reports(.*)",
  "/reports(.*)",
  "/drafter(.*)",
  "/team(.*)",
  "/api/ai(.*)",
]);

const clerkProxy = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }

  return clerkProxy(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|png|jpg|jpeg|webp|svg|ico|ttf|woff2?)).*)",
    "/(api|trpc|__clerk)(.*)",
  ],
};
