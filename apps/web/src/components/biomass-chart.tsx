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
import { Loader2 } from "lucide-react";
import { SimpleMarkdown } from "./ai-copilot";

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
    return <div className="text-sm text-neutral-500">Loading harvest data…</div>;
  }

  if (data.length === 0) {
    return <div className="text-sm text-neutral-500">No harvest data available.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Estimated Biomass vs Actual Yield (kg)
        </h3>
        <button
          onClick={handleExplainAI}
          disabled={explaining}
          className="flex items-center gap-1.5 rounded bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 dark:bg-indigo-950/20 dark:border-indigo-900/30 dark:text-indigo-400"
        >
          {explaining ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Explain with AI</span>
          )}
        </button>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="estimated"
              name="Estimated Biomass"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="actual"
              name="Actual Yield"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expandable Chart Explanation Box */}
      {explanation && (
        <div className="rounded-md border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">
            AI Chart Explanation
          </h4>
          <SimpleMarkdown content={explanation} />
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50/50 p-3 text-xs text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
