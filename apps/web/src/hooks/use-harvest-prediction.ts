"use client";

import { useEffect, useState, useCallback } from "react";
import type { HarvestRecord } from "@/types/models";
import { rpc } from "@/lib/api-client";

interface ChartDatum {
  date: string;
  estimated: number;
  actual: number;
}

interface PredictionResult {
  chartData: ChartDatum[];
  loading: boolean;
  error: string | null;
  nextHarvestEstimate: number;
  averageYieldPercent: number;
}

function toChartData(records: HarvestRecord[]): ChartDatum[] {
  return [...records]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: r.date,
      estimated: r.estimatedBiomassKg,
      actual: r.actualYieldKg,
    }));
}

function linearRegression(values: number[]): { slope: number; intercept: number } {
  const n = values.length;
  if (n < 2) return { slope: 0, intercept: values[0] ?? 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: sumY / n };

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

function predictNext(records: HarvestRecord[]): number {
  const sorted = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const biomassValues = sorted.map((r) => r.estimatedBiomassKg);
  const { slope, intercept } = linearRegression(biomassValues);
  return Math.round(Math.max(0, slope * biomassValues.length + intercept));
}

function computeAverageYield(records: HarvestRecord[]): number {
  if (records.length === 0) return 0;
  const totalEstimated = records.reduce((s, r) => s + r.estimatedBiomassKg, 0);
  const totalActual = records.reduce((s, r) => s + r.actualYieldKg, 0);
  return totalEstimated > 0
    ? Math.round((totalActual / totalEstimated) * 1000) / 10
    : 0;
}

export function useHarvestPrediction(): PredictionResult {
  const [records, setRecords] = useState<HarvestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHarvestData = useCallback(async (pondId: number) => {
    try {
      const res = await rpc.harvest.$get({
        query: {
          pondId: String(pondId),
          limit: 50,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch harvest logs");
      const json = (await res.json()) as any;
      if (json.success && json.data) {
        const mapped: HarvestRecord[] = json.data.map((log: any) => ({
          date: log.timestamp.split("T")[0],
          estimatedBiomassKg: log.estimatedBiomassKg,
          actualYieldKg: log.actualYieldKg,
          pondId: String(pondId),
          species: log.species,
        }));
        setRecords(mapped);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch harvest data");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const pondsRes = await rpc.ponds.$get();
        if (!pondsRes.ok) throw new Error("Failed to fetch ponds list");
        const pondsJson = (await pondsRes.json()) as any;
        if (pondsJson.success && pondsJson.data && pondsJson.data.length > 0) {
          const firstPondId = pondsJson.data[0].id;
          if (!cancelled) {
            await fetchHarvestData(firstPondId);
          }
        } else {
          if (!cancelled) {
            setRecords([]);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to initialize harvest prediction");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [fetchHarvestData]);

  const chartData = toChartData(records);
  const nextHarvestEstimate = predictNext(records);
  const averageYieldPercent = computeAverageYield(records);

  return { chartData, loading, error, nextHarvestEstimate, averageYieldPercent };
}
