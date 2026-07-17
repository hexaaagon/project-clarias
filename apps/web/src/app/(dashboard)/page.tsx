"use client";

import { Activity, Package, Scale, Waves } from "lucide-react";
import { AICopilotSection } from "@/components/ai-copilot";
import { BiomassChart } from "@/components/biomass-chart";
import { EnvironmentMonitor } from "@/components/environment-monitor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusSeparator } from "@/components/ui/plus-separator";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold font-montreal text-3xl tracking-tight">
          Dashboard Overview
        </h1>
        <p className="font-mono text-muted-foreground text-sm">
          Real-time metrics and AI insights for your active ponds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border border-separator/10 bg-muted/20 shadow-sm transition hover:bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
              Active Ponds
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold font-mono text-2xl text-foreground">3</div>
            <p className="text-muted-foreground text-xs">
              +1 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-separator/10 bg-muted/20 shadow-sm transition hover:bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
              Estimated Biomass
            </CardTitle>
            <Scale className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold font-mono text-2xl text-foreground">
              4,250 <span className="font-normal text-sm">kg</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Harvest ready in 14 days
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-separator/10 bg-muted/20 shadow-sm transition hover:bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
              Average DO
            </CardTitle>
            <Waves className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold font-mono text-2xl text-foreground">
              6.8 <span className="font-normal text-sm">mg/L</span>
            </div>
            <p className="text-emerald-500 text-xs">
              All ponds within safe limits
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-separator/10 bg-muted/20 shadow-sm transition hover:bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
              Total Feed Disbursed
            </CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold font-mono text-2xl text-foreground">
              1,240 <span className="font-normal text-sm">kg</span>
            </div>
            <p className="text-muted-foreground text-xs">
              This cycle (Pond-01)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-8">
        <section className="relative overflow-hidden rounded-xl border border-separator/10 bg-background p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-separator/10 border-b pb-4">
            <div>
              <h2 className="font-bold font-montreal text-xl text-foreground">
                Harvest Performance
              </h2>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Estimated vs Actual Yield Tracking
              </p>
            </div>
          </div>
          <BiomassChart />
          <PlusSeparator position={["top-left", "top-right"]} />
        </section>

        <section className="relative overflow-hidden rounded-xl border border-separator/10 bg-background p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-separator/10 border-b pb-4">
            <div>
              <h2 className="font-bold font-montreal text-xl text-foreground">
                Environment Snapshot
              </h2>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Realtime Sensor Telemetry
              </p>
            </div>
          </div>
          <EnvironmentMonitor />
          <PlusSeparator position={["top-left", "top-right"]} />
        </section>

        <section className="relative overflow-hidden rounded-xl border border-separator/10 bg-background p-6 shadow-sm">
          <div className="mb-6 border-separator/10 border-b pb-4">
            <h2 className="font-bold font-montreal text-xl text-foreground">
              Clarie AI
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Your Smart Pond Assistant
            </p>
          </div>
          <AICopilotSection />
          <PlusSeparator position={["top-left", "top-right"]} />
        </section>
      </div>
    </div>
  );
}
