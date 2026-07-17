import { getHarvestStats } from "@/services/mock-data";
import { PlusSeparator } from "@/components/ui/plus-separator";
import { Warehouse, ArrowUpRight, Scale } from "lucide-react";

export default async function HarvestPage() {
  const harvestLogs = await getHarvestStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-3 font-bold font-montreal text-3xl tracking-tight text-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm">
            <Warehouse className="h-5 w-5" />
          </div>
          Post-Harvest Analytics
        </h1>
        <p className="font-mono text-muted-foreground text-sm max-w-2xl">
          Harvest logs, yield analysis, and supply-chain distribution tracking. Compare estimated biomass against actual yield output for cycle optimizations.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-xl border border-separator/10 bg-background shadow-sm">
        <div className="flex items-center justify-between border-separator/10 border-b bg-muted/20 px-6 py-4">
          <div>
            <h2 className="font-bold font-montreal text-lg text-foreground">
              Historical Harvest Logs
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              Sorted by latest completion date
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-separator/10 border-b bg-muted/5 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Pond ID</th>
                <th className="px-6 py-4 font-medium">Species</th>
                <th className="px-6 py-4 font-medium text-right">Est. Biomass</th>
                <th className="px-6 py-4 font-medium text-right">Actual Yield</th>
                <th className="px-6 py-4 font-medium text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-separator/10">
              {harvestLogs.map((log, index) => {
                const variance = log.actualYieldKg - log.estimatedBiomassKg;
                const variancePercent = (variance / log.estimatedBiomassKg) * 100;
                const isPositive = variance >= 0;

                return (
                  <tr 
                    key={`${log.pondId}-${log.date}`}
                    className="transition-colors hover:bg-muted/10 group"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-mono font-medium text-foreground">
                      {log.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full border border-separator/20 bg-background px-2.5 py-0.5 font-mono text-[10px] font-semibold text-foreground shadow-sm group-hover:border-blue-500/30 group-hover:text-blue-600 transition-colors">
                        {log.pondId}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                      {log.species}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-muted-foreground">
                      {log.estimatedBiomassKg.toLocaleString()} kg
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-mono font-semibold text-foreground">
                      {log.actualYieldKg.toLocaleString()} kg
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
                        <span className={isPositive ? "text-emerald-500" : "text-red-500"}>
                          {isPositive ? "+" : ""}{variance.toLocaleString()} kg
                        </span>
                        <span className="text-muted-foreground/60 text-[10px]">
                          ({variancePercent.toFixed(1)}%)
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {harvestLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Scale className="mb-4 h-8 w-8 text-muted-foreground/30" />
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              No harvest records found
            </p>
          </div>
        )}
        
        <PlusSeparator position={["top-left", "top-right"]} />
      </section>
    </div>
  );
}
