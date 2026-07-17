"use client";

import { useEffect, useState } from "react";
import { useAIStoreState, useAIStoreActions } from "@/lib/ai-cache-store";
import { rpc } from "@/lib/api-client";
import { AlertCircle, Bot, Loader2, Send, Sparkles } from "lucide-react";

/**
 * Parses AI-generated markdown text into structured blocks,
 * then renders them cleanly without erratic spacing.
 */
export function ParsedContent({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, blockIdx) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return null;

        // Check if all lines are list items
        const allList = lines.every(
          (l) => l.startsWith("- ") || l.startsWith("* ") || l.match(/^\d+\.\s/)
        );

        if (allList) {
          return (
            <ul key={blockIdx} className="flex flex-col gap-1.5 pl-4">
              {lines.map((line, i) => (
                <li
                  key={i}
                  className="list-disc text-sm leading-relaxed text-muted-foreground"
                >
                  <InlineFormat text={line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "")} />
                </li>
              ))}
            </ul>
          );
        }

        // Check if first line is a heading
        const first = lines[0];
        if (first.startsWith("###")) {
          return (
            <div key={blockIdx} className="flex flex-col gap-1.5">
              <h4 className="font-montreal font-semibold text-sm text-foreground">
                {first.replace(/^#{1,3}\s*/, "")}
              </h4>
              {lines.slice(1).map((l, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                  <InlineFormat text={l} />
                </p>
              ))}
            </div>
          );
        }
        if (first.startsWith("##")) {
          return (
            <div key={blockIdx} className="flex flex-col gap-1.5">
              <h3 className="font-montreal font-semibold text-base text-foreground">
                {first.replace(/^#{1,2}\s*/, "")}
              </h3>
              {lines.slice(1).map((l, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                  <InlineFormat text={l} />
                </p>
              ))}
            </div>
          );
        }

        // Default: paragraph
        return (
          <p key={blockIdx} className="text-sm leading-relaxed text-muted-foreground">
            <InlineFormat text={lines.join(" ")} />
          </p>
        );
      })}
    </div>
  );
}

/** Handles **bold** inline formatting */
function InlineFormat({ text }: { text: string }) {
  const parts = text.split("**");
  if (parts.length <= 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/** Backward-compatible alias for biomass-chart */
export const SimpleMarkdown = ParsedContent;

export function AICopilotSection() {
  const dashboardSummary = useAIStoreState((s) => s.dashboardSummary);
  const dailySummary = useAIStoreState((s) => s.dailySummary);
  const recommendations = useAIStoreState((s) => s.recommendations);
  const pondId = useAIStoreState((s) => s.pondId);
  const loading = useAIStoreState((s) => s.loading);
  const error = useAIStoreState((s) => s.error);

  const initializeAI = useAIStoreActions((a) => a.initializeAI);

  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    initializeAI();
  }, [initializeAI]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pondId || !chatQuestion.trim()) return;
    setChatLoading(true);
    setChatAnswer("");
    try {
      const res = await rpc.ai.chat.$post({
        json: { pondId, question: chatQuestion },
      });
      if (!res.ok) throw new Error();
      const json = (await res.json()) as any;
      if (json.success) {
        setChatAnswer(json.data.answer);
      } else {
        setChatAnswer("AI service encountered an error answering your question.");
      }
    } catch {
      setChatAnswer("AI service is currently unavailable.");
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        Loading AI insights...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
        <span className="font-mono text-xs text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Dashboard Summary — headline + stats */}
      {dashboardSummary && (
        <div className="flex flex-col gap-5">
          {/* Health stats row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="flex flex-col rounded-xl border border-separator/10 bg-muted/20 p-5">
              <span className="font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
                Health Score
              </span>
              <p className="mt-2 font-bold font-mono text-3xl tracking-tight text-foreground">
                {dashboardSummary.healthScore}
                <span className="ml-1 font-normal text-sm opacity-60">%</span>
              </p>
            </div>
            <div className="flex flex-col rounded-xl border border-separator/10 bg-muted/20 p-5">
              <span className="font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
                Confidence
              </span>
              <p className="mt-2 font-bold font-mono text-3xl tracking-tight text-foreground">
                {dashboardSummary.confidence}
                <span className="ml-1 font-normal text-sm opacity-60">%</span>
              </p>
            </div>
          </div>

          {/* Headline + summary text */}
          <div className="flex flex-col gap-2">
            <p className="font-montreal font-semibold text-sm text-foreground">
              &ldquo;{dashboardSummary.headline}&rdquo;
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {dashboardSummary.summary}
            </p>
          </div>

          {/* Top recommendation */}
          {dashboardSummary.recommendations?.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-separator/10 bg-muted/20 p-4">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <div className="flex flex-col gap-1">
                <span className="font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
                  Top Recommendation
                </span>
                <p className="text-sm leading-relaxed text-foreground">
                  {dashboardSummary.recommendations[0]}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Two-column row: Today's Summary + Pond Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Today's Summary */}
        <div className="flex flex-col rounded-xl border border-separator/10 bg-muted/20 p-5">
          <span className="mb-4 font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
            Today&apos;s Summary
          </span>
          {dailySummary ? (
            <ParsedContent content={dailySummary} />
          ) : (
            <p className="text-sm text-muted-foreground">No daily logs compiled.</p>
          )}
        </div>

        {/* Pond Actions */}
        <div className="flex flex-col rounded-xl border border-separator/10 bg-muted/20 p-5">
          <span className="mb-4 font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
            Pond Actions
          </span>
          {recommendations.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-separator/10 bg-background p-3 text-sm leading-relaxed text-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  {rec}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No recommended actions available.</p>
          )}
        </div>
      </div>

      {/* Ask AI */}
      <div className="flex flex-col gap-4 rounded-xl border border-separator/10 bg-muted/20 p-5">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-500" />
          <span className="font-mono font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
            Ask Clarias Copilot
          </span>
        </div>

        <form onSubmit={handleAskAI} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <textarea
            value={chatQuestion}
            onChange={(e) => setChatQuestion(e.target.value)}
            placeholder="Ask anything about your pond..."
            rows={2}
            className="flex-1 resize-none rounded-lg border border-separator/10 bg-background p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={chatLoading || !chatQuestion.trim()}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {chatLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Ask AI
              </>
            )}
          </button>
        </form>

        {chatAnswer && (
          <div className="rounded-lg border border-separator/10 bg-background p-4">
            <ParsedContent content={chatAnswer} />
          </div>
        )}
      </div>
    </div>
  );
}
