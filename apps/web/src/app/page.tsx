"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { EnvironmentMonitor } from "@/components/environment-monitor";
import { BiomassChart } from "@/components/biomass-chart";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();

  function handleSignOut() {
    document.cookie = "clarias-auth=; path=/; max-age=0";
    router.push("/home");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-medium">Environment Snapshot</h2>
        <EnvironmentMonitor />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Harvest Performance</h2>
        <BiomassChart />
      </section>
    </div>
  );
}
