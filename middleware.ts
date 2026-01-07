import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if pathname already has a locale
  const pathnameHasLocale = /^\/(en|pt)(\/|$)/.test(pathname);
  
  if (!pathnameHasLocale) {
    // Get locale from cookie, Accept-Language header, or default to 'pt'
    let locale = request.cookies.get("locale")?.value;
    
    // If no cookie, try Accept-Language header
    if (!locale) {
      const acceptLanguage = request.headers.get("accept-language");
      if (acceptLanguage?.includes("pt")) {
        locale = "pt";
      } else if (acceptLanguage?.includes("en")) {
        locale = "en";
      }
    }
    
    // Default to Portuguese
    locale = locale || "pt";
    
    // Redirect to locale path
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next (Next.js internals)
    // - files with extensions (e.g. .ico, .png)
    "/((?!api|_next|.*\\..*).*)",
  ],
};

