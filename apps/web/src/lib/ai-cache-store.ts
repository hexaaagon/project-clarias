"use client";

import { createStore, createTypedHooks, action, thunk, persist } from "easy-peasy";
import type { Action, Thunk } from "easy-peasy";
import { rpc } from "@/lib/api-client";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CachedAIData {
  dashboardSummary: any | null;
  dailySummary: string;
  recommendations: string[];
  pondId: number | null;
  cachedAt: number | null; // epoch ms
}

export interface AIStoreModel {
  // state
  dashboardSummary: any | null;
  dailySummary: string;
  recommendations: string[];
  pondId: number | null;
  cachedAt: number | null;
  loading: boolean;
  error: string | null;

  // actions
  setDashboardSummary: Action<AIStoreModel, any | null>;
  setDailySummary: Action<AIStoreModel, string>;
  setRecommendations: Action<AIStoreModel, string[]>;
  setPondId: Action<AIStoreModel, number | null>;
  setCachedAt: Action<AIStoreModel, number | null>;
  setLoading: Action<AIStoreModel, boolean>;
  setError: Action<AIStoreModel, string | null>;
  clearCache: Action<AIStoreModel>;

  // thunks
  fetchAIData: Thunk<AIStoreModel, number>;
  initializeAI: Thunk<AIStoreModel>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function isCacheValid(cachedAt: number | null): boolean {
  if (!cachedAt) return false;
  return Date.now() - cachedAt < TWENTY_FOUR_HOURS_MS;
}

// ── Store ──────────────────────────────────────────────────────────────────────

export const aiCacheStore = createStore<AIStoreModel>(
  persist(
    {
      // initial state
      dashboardSummary: null,
      dailySummary: "",
      recommendations: [],
      pondId: null,
      cachedAt: null,
      loading: true,
      error: null,

      // actions
      setDashboardSummary: action((state, payload) => {
        state.dashboardSummary = payload;
      }),
      setDailySummary: action((state, payload) => {
        state.dailySummary = payload;
      }),
      setRecommendations: action((state, payload) => {
        state.recommendations = payload;
      }),
      setPondId: action((state, payload) => {
        state.pondId = payload;
      }),
      setCachedAt: action((state, payload) => {
        state.cachedAt = payload;
      }),
      setLoading: action((state, payload) => {
        state.loading = payload;
      }),
      setError: action((state, payload) => {
        state.error = payload;
      }),
      clearCache: action((state) => {
        state.dashboardSummary = null;
        state.dailySummary = "";
        state.recommendations = [];
        state.pondId = null;
        state.cachedAt = null;
      }),

      // thunks
      fetchAIData: thunk(async (actions, activeId) => {
        try {
          actions.setError(null);

          const summaryRes = await rpc.ai["dashboard-summary"].$post({
            json: { pondId: activeId },
          });
          if (!summaryRes.ok) throw new Error();
          const summaryJson = (await summaryRes.json()) as any;
          if (summaryJson.success) {
            actions.setDashboardSummary(summaryJson.data);
          }

          const dailyRes = await rpc.ai["daily-summary"].$post({
            json: { pondId: activeId },
          });
          if (dailyRes.ok) {
            const dailyJson = (await dailyRes.json()) as any;
            if (dailyJson.success) {
              actions.setDailySummary(dailyJson.data.summary);
            }
          }

          const recsRes = await rpc.ai.recommendations.$post({
            json: { pondId: activeId },
          });
          if (recsRes.ok) {
            const recsJson = (await recsRes.json()) as any;
            if (recsJson.success) {
              actions.setRecommendations(recsJson.data.recommendations);
            }
          }

          // Mark cache timestamp
          actions.setPondId(activeId);
          actions.setCachedAt(Date.now());
        } catch {
          actions.setError("AI service is currently unavailable.");
        } finally {
          actions.setLoading(false);
        }
      }),

      initializeAI: thunk(async (actions, _payload, { getState }) => {
        const state = getState();

        // If cache is still valid, skip the network call
        if (state.pondId && isCacheValid(state.cachedAt)) {
          actions.setLoading(false);
          return;
        }

        try {
          const pondsRes = await rpc.ponds.$get();
          if (!pondsRes.ok) throw new Error();
          const pondsJson = (await pondsRes.json()) as any;
          if (pondsJson.success && pondsJson.data?.length > 0) {
            const firstPondId = pondsJson.data[0].id;
            actions.setPondId(firstPondId);
            await actions.fetchAIData(firstPondId);
          } else {
            actions.setError("No active ponds found to analyze.");
            actions.setLoading(false);
          }
        } catch {
          actions.setError("AI service is currently unavailable.");
          actions.setLoading(false);
        }
      }),
    },
    {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      allow: [
        "dashboardSummary",
        "dailySummary",
        "recommendations",
        "pondId",
        "cachedAt",
      ],
    }
  )
);

// ── Typed Hooks ────────────────────────────────────────────────────────────────

const typedHooks = createTypedHooks<AIStoreModel>();

export const useAIStoreState = typedHooks.useStoreState;
export const useAIStoreActions = typedHooks.useStoreActions;
