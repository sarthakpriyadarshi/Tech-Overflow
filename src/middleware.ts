import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getOrCreateDB from "@/models/server/dbSetup";
import getOrCreateStorage from "./models/server/storageSetup";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("Middleware triggered for request:", request.nextUrl.pathname);
  await Promise.all([getOrCreateDB(), getOrCreateStorage()]);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api|static|assets|images|fonts|styles|robots.txt).*)",
  ],
};
