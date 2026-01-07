"use client";

import { useAuthStore } from "@/store/auth-store";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search stations..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

