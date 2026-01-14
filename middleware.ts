import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const locale = request.cookies.get("locale")?.value;
  
  if (!locale) {
    const acceptLanguage = request.headers.get("accept-language");
    let detectedLocale = "pt";
    
    if (acceptLanguage?.includes("en")) {
      detectedLocale = "en";
    }
    
    response.cookies.set("locale", detectedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
  ],
};

