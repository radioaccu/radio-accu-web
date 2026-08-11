import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const portalHostname = "submit.radioaccu.com";
const portalPath = "/guest-mix-submit";

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const pathname = request.nextUrl.pathname;

  if (hostname === portalHostname) {
    if (pathname === "/") {
      const destination = request.nextUrl.clone();
      destination.pathname = portalPath;
      return NextResponse.redirect(destination);
    }

    if (pathname !== portalPath) {
      const destination = request.nextUrl.clone();
      destination.pathname = portalPath;
      destination.search = "";
      return NextResponse.redirect(destination);
    }

    return NextResponse.next();
  }

  if (pathname === portalPath && hostname !== "localhost" && hostname !== "127.0.0.1") {
    const destination = request.nextUrl.clone();
    destination.protocol = "https:";
    destination.hostname = portalHostname;
    destination.port = "";
    return NextResponse.redirect(destination);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[^/]+$).*)"],
};
