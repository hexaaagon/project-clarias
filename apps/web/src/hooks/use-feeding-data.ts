"use client";

import { useCallback, useEffect, useState } from "react";
import type { FeedingEvent } from "@/types/models";
import { rpc } from "@/lib/api-client";

interface FeedingHookResult {
  events: FeedingEvent[];
  loading: boolean;
  error: string | null;
  totalFeedKg: number;
  addFeedingEvent: (event: Omit<FeedingEvent, "date">) => Promise<void>;
}

export function useFeedingData(): FeedingHookResult {
  const [events, setEvents] = useState<FeedingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePondId, setActivePondId] = useState<number | null>(null);

  const fetchFeedingData = useCallback(async (pondId: number) => {
    try {
      const res = await rpc.feeding.$get({
        query: {
          pondId: String(pondId),
          limit: 50,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch feeding history");
      const json = (await res.json()) as any;
      if (json.success && json.data) {
        const mapped: FeedingEvent[] = json.data.map((log: any) => ({
          date: log.timestamp,
          feedType: log.feedType,
          amountKg: log.amountKg,
          pondId: String(pondId),
        }));
        setEvents(mapped);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch feeding data");
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
            setActivePondId(firstPondId);
            await fetchFeedingData(firstPondId);
          }
        } else {
          if (!cancelled) {
            setEvents([]);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to initialize feeding data");
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
  }, [fetchFeedingData]);

  const addFeedingEvent = useCallback(
    async (event: Omit<FeedingEvent, "date">) => {
      // Find pond ID to write to
      const targetPondId = activePondId;
      if (!targetPondId) return;

      try {
        const res = await rpc.feeding.$post({
          json: {
            pondId: targetPondId,
            feedType: event.feedType,
            amountKg: event.amountKg,
          },
        });
        if (!res.ok) throw new Error("Failed to add feeding event");
        await fetchFeedingData(targetPondId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add feeding event");
      }
    },
    [activePondId, fetchFeedingData],
  );

  const totalFeedKg = events.reduce((sum, e) => sum + e.amountKg, 0);

  return { events, loading, error, totalFeedKg, addFeedingEvent };
}
