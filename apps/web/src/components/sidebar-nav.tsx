"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  function handleSignOut() {
    document.cookie = "clarias-auth=; path=/; max-age=0";
    router.push("/home");
  }

  return (
    <nav className="flex flex-1 flex-col gap-0.5 p-3">
      <span className="mb-2 px-3 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
        Navigation
      </span>
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm transition-all duration-200",
              isActive
                ? "border border-blue-500/20 bg-blue-500/10 text-blue-600 shadow-sm"
                : "border border-transparent text-muted-foreground hover:border-separator/10 hover:bg-muted/20 hover:text-foreground"
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive ? "text-blue-600" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <span className="font-mono text-[13px] tracking-tight">
              {item.label}
            </span>
          </Link>
        );
      })}

      <div className="mx-3 my-3 border-separator/10 border-t" />

      <button
        type="button"
        onClick={handleSignOut}
        className="group flex items-center gap-3 rounded-md border border-transparent px-3 py-2 font-medium text-sm text-muted-foreground transition-all duration-200 hover:border-red-500/10 hover:bg-red-500/5 hover:text-red-600"
      >
        <LogOut className="h-4 w-4 shrink-0 transition-colors group-hover:text-red-600" />
        <span className="font-mono text-[13px] tracking-tight">Sign out</span>
      </button>
    </nav>
  );
}
