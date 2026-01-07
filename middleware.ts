import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Set locale cookie if not present
  const locale = request.cookies.get("locale")?.value;
  
  if (!locale) {
    // Get locale from Accept-Language header or default to 'pt'
    const acceptLanguage = request.headers.get("accept-language");
    let detectedLocale = "pt";
    
    if (acceptLanguage?.includes("en")) {
      detectedLocale = "en";
    }
    
    // Set cookie
    response.cookies.set("locale", detectedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
  
  return response;
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

