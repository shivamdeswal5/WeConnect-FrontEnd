import isAuthenticated from "./firebase/isAuthenticated"
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  console.log("calling fb",await isAuthenticated())
  const bool = await isAuthenticated();
  if ( !bool) {
    const absoluteURL = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export const config = {
  matcher: ['/dashboard'],
}