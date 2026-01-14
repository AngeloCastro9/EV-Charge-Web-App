"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "EN", label: "English" },
  { code: "pt", name: "PT", label: "Português" },
];

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card/50 p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
            locale === lang.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
          title={lang.label}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}

