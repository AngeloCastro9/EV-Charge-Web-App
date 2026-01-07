"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState("en");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const t = useTranslations("home");

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated && locale) {
      router.push(`/${locale}/dashboard`);
    }
  }, [mounted, isAuthenticated, router, locale]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 max-w-2xl"
      >
        <div className="flex justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
          >
            <Zap className="h-10 w-10 text-primary" />
          </motion.div>
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/login">{t("signIn")}</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/signup">{t("getStarted")}</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

