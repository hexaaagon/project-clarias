import { FinanceReport } from "@/components/finance-report";
import { BadgeDollarSign } from "lucide-react";

export default function FinancePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-3 font-bold font-montreal text-3xl tracking-tight text-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 border border-orange-500/20 shadow-sm">
            <BadgeDollarSign className="h-5 w-5" />
          </div>
          Financial Analytics
        </h1>
        <p className="font-mono text-muted-foreground text-sm max-w-2xl">
          Track expected revenue, project your gross margins, and generate detailed PDF reports suitable for agricultural loans and stakeholder updates.
        </p>
      </div>
      
      <FinanceReport />
    </div>
  );
}
