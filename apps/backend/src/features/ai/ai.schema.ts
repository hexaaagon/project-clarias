import z from "zod";

export const chatInputSchema = z.object({
  pondId: z.number().int().positive(),
  question: z.string().min(1, "Question cannot be empty"),
});

export const dashboardInputSchema = z.object({
  pondId: z.number().int().positive(),
});

export const recommendationsInputSchema = z.object({
  pondId: z.number().int().positive(),
});

export const explainChartInputSchema = z.object({
  pondId: z.number().int().positive(),
  chart: z.string().min(1, "Chart name is required"),
  history: z.array(z.any()).min(1, "History data cannot be empty"),
});

export const dailySummaryInputSchema = z.object({
  pondId: z.number().int().positive(),
});
