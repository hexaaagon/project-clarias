"use client";

import { AlertTriangle, Droplets, Thermometer, Waves } from "lucide-react";
import { useEnvironmentData } from "@/hooks/use-environment-data";
import { cn } from "@/lib/utils";

export function EnvironmentMonitor() {
  const { data, loading } = useEnvironmentData();

  if (loading) {
    return (
      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
        Loading sensor data...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="font-mono text-[10px] text-red-500 uppercase tracking-wider">
        Failed to load sensor data.
      </div>
    );
  }

  const metrics = [
    {
      label: "Dissolved Oxygen",
      value: `${data.dissolvedOxygen}`,
      unit: "mg/L",
      icon: Droplets,
      color: "text-blue-500",
    },
    {
      label: "pH Level",
      value: data.pH.toFixed(1),
      unit: "",
      icon: Waves,
      color: "text-emerald-500",
    },
    {
      label: "Temperature",
      value: `${data.temperature}`,
      unit: "°C",
      icon: Thermometer,
      color: "text-orange-500",
    },
    {
      label: "Water Level",
      value: `${data.waterLevel}`,
      unit: "m",
      icon: Waves,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {data.hasAlert && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 shadow-sm backdrop-blur-sm">
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </div>
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
          <span className="font-mono font-medium text-xs text-red-600 uppercase tracking-wide">
            CRITICAL ALERT: Water quality parameters outside safe thresholds
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={cn(
              "flex flex-col rounded-xl border p-5 shadow-sm transition-all duration-300",
              data.hasAlert
                ? "border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
                : "border-separator/10 bg-muted/20 hover:bg-muted/30"
            )}
          >
            <div className="flex items-center gap-2">
              <metric.icon className={cn("h-4 w-4 shrink-0", metric.color)} />
              <span className="font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                {metric.label}
              </span>
            </div>
            <p className={cn(
              "mt-3 font-bold font-mono text-3xl tracking-tight",
              data.hasAlert ? "text-red-500" : "text-foreground"
            )}>
              {metric.value}
              {metric.unit && (
                <span className="ml-1 font-normal text-sm opacity-60">
                  {metric.unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-separator/10 border-t pt-4">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          Live stream • Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
