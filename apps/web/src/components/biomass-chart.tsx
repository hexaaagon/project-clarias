"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useHarvestPrediction } from "@/hooks/use-harvest-prediction";
import { rpc } from "@/lib/api-client";
import { Loader2, Sparkles } from "lucide-react";
import { SimpleMarkdown } from "./ai-copilot";
import { cn } from "@/lib/utils";

export function BiomassChart() {
  const { chartData: data, loading } = useHarvestPrediction();
  const [explanation, setExplanation] = useState("");
  const [explaining, setExplaining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplainAI = async () => {
    setExplaining(true);
    setError(null);
    setExplanation("");
    try {
      const pondsRes = await rpc.ponds.$get();
      if (!pondsRes.ok) throw new Error();
      const pondsJson = (await pondsRes.json()) as any;
      if (pondsJson.success && pondsJson.data && pondsJson.data.length > 0) {
        const pId = pondsJson.data[0].id;
        const historyPayload = data.map((item) => ({
          date: item.date,
          estimatedBiomassKg: item.estimated,
          actualYieldKg: item.actual,
        }));

        const res = await rpc.ai["explain-chart"].$post({
          json: {
            pondId: pId,
            chart: "Estimated Biomass vs Actual Yield",
            history: historyPayload,
          },
        });
        if (!res.ok) throw new Error();
        const json = (await res.json()) as any;
        if (json.success) {
          setExplanation(json.data.explanation);
        } else {
          setError("AI service was unable to explain this chart.");
        }
      } else {
        setError("No active ponds found to explain.");
      }
    } catch {
      setError("AI service is currently unavailable.");
    } finally {
      setExplaining(false);
    }
  };

  if (loading) {
    return <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Loading harvest data...</div>;
  }

  if (data.length === 0) {
    return <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">No harvest data available.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <button
          onClick={handleExplainAI}
          disabled={explaining}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 font-bold font-mono text-[10px] uppercase transition-all duration-300",
            explaining
              ? "border-blue-500/30 bg-blue-500/10 text-blue-500 opacity-80"
              : "border-separator/20 bg-background text-foreground shadow-sm hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-600"
          )}
        >
          {explaining ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Analyzing</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Explain with AI</span>
            </>
          )}
        </button>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-background)",
                borderColor: "rgba(0,0,0,0.1)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                textTransform: "uppercase",
              }}
            />
            <Bar
              dataKey="estimated"
              name="Estimated"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
            <Bar
              dataKey="actual"
              name="Actual"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {explanation && (
        <div className="rounded-xl border border-separator/10 bg-blue-500/5 p-5">
          <div className="mb-3 flex items-center gap-2 border-separator/10 border-b pb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px]">🌸</div>
            <h4 className="font-bold font-mono text-[10px] text-blue-600 uppercase tracking-wider">
              Clarie AI Insight
            </h4>
          </div>
          <div className="text-foreground text-sm leading-relaxed">
            <SimpleMarkdown content={explanation} />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 font-mono font-medium text-xs text-red-600">
          <span className="flex h-1.5 w-1.5 rounded-full bg-red-500" />
          {error}
        </div>
      )}
    </div>
  );
}
