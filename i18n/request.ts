import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  // Get locale from cookie, header, or default to 'pt' (Portuguese as default)
  const cookieStore = await cookies();
  const headersList = await headers();
  
  // Try to get locale from cookie first
  let locale = cookieStore.get("locale")?.value;
  
  // If no cookie, try to get from Accept-Language header
  if (!locale) {
    const acceptLanguage = headersList.get("accept-language");
    if (acceptLanguage?.includes("pt")) {
      locale = "pt";
    } else if (acceptLanguage?.includes("en")) {
      locale = "en";
    }
  }
  
  // Default to Portuguese
  locale = locale || "pt";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

