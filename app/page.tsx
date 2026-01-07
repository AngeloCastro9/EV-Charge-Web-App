"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, router]);

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
            EV Charge Manager
          </h1>
          <p className="text-xl text-muted-foreground">
            High-end dashboard for EV charging management
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

