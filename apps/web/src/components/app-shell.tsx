"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SidebarNav } from "@/components/sidebar-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen">
      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Top bar (mobile only — contains hamburger) */}
        <header className="flex h-14 items-center gap-3 border-neutral-200 border-b px-4 lg:hidden dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold">Project Clarias</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
