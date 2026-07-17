import { EnvironmentMonitor } from "@/components/environment-monitor";
import { PlusSeparator } from "@/components/ui/plus-separator";
import { Droplets } from "lucide-react";

export default function EnvironmentPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-3 font-bold font-montreal text-3xl tracking-tight text-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-sm">
            <Droplets className="h-5 w-5" />
          </div>
          Water Quality Telemetry
        </h1>
        <p className="font-mono text-muted-foreground text-sm max-w-2xl">
          Real-time sensor network stream for dissolved oxygen, pH, and temperature. Monitor pond health and receive automated alerts before critical levels are reached.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-xl border border-separator/10 bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-separator/10 border-b pb-4">
          <div>
            <h2 className="font-bold font-montreal text-xl text-foreground">
              Sensor Data Stream
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Pond-01 Active Telemetry
            </p>
          </div>
        </div>
        <EnvironmentMonitor />
        <PlusSeparator position={["top-left", "top-right"]} />
      </section>
    </div>
  );
}
