/**
 * System and instruction prompts for Project Clarias AI Copilot.
 */

export const SYSTEM_PROMPT = `You are Project Clarias AI Copilot, a professional freshwater aquaculture consultant specializing in Catfish (Clarias) farming.

Your responsibilities are to:
1. Interpret telemetry and sensor parameters (dissolved oxygen, pH, water level, temperature).
2. Explain observations and identify risks to fish health and pond conditions.
3. Recommend specific corrective actions prioritizing fish welfare.
4. Help beginner farmers understand water quality dynamics.

Rules:
- NEVER hallucinate or fabricate sensor values.
- NEVER invent historical events or pretend data exists.
- If telemetry or information is missing, explicitly state so.
- Always be concise.
- Structure explanations with the following structure where relevant:
  - Current Condition
  - Cause
  - Impact
  - Recommendation
  - Confidence (High/Medium/Low with rationale)
`;

/**
 * Builds chat query prompt.
 */
export function buildChatPrompt(context: string, question: string): string {
  return `Context of the Pond:
${context}

User Question:
${question}

Answer the farmer's question using the system prompt guidelines.`;
}

/**
 * Builds dashboard overview query prompt.
 */
export function buildDashboardPrompt(context: string): string {
  return `Context of the Pond:
${context}

Generate a dashboard summary JSON object. You MUST return ONLY a valid JSON object matching this schema:
{
  "healthScore": 0-100,
  "headline": "A short, engaging high-level summary sentence",
  "summary": "Detailed explanation of the current state of the pond",
  "issues": ["List of identified issues or warning flags"],
  "recommendations": ["List of recommended actions for the farmer"],
  "confidence": 0-100
}

Do not include any extra text, markdown blocks (like \`\`\`json), or explanations outside of the JSON structure.`;
}

/**
 * Builds recommendations query prompt.
 */
export function buildRecommendationPrompt(context: string): string {
  return `Context of the Pond:
${context}

Generate actionable recommendations for the farmer. You MUST return ONLY a valid JSON object matching this schema:
{
  "recommendations": ["List of action items with concrete instructions"]
}

Do not include any extra text, markdown blocks (like \`\`\`json), or explanations outside of the JSON structure.`;
}

/**
 * Builds chart explanation query prompt.
 */
export function buildChartPrompt(context: string, chartName: string, historyData: string): string {
  return `Context of the Pond:
${context}

Chart Name: ${chartName}
Historical Data:
${historyData}

Explain the trends and observations in this chart. 

CRITICAL RULES:
1. Write the explanation in clean, natural language paragraphs.
2. ABSOLUTELY NO Markdown tables (DO NOT use the | character to format data).
3. DO NOT use bullet points, bold text (**), or numbered lists.
4. OVERRIDE the systemic structure rules (Current Condition, Cause, Impact, Recommendation) for this specific response. Do not use those headers.
5. Keep it concise. Explain what the trends mean for fish health and water stability in 2 to 3 short, easy-to-read paragraphs.`;
}

/**
 * Builds daily summary query prompt.
 */
export function buildDailySummaryPrompt(context: string): string {
  return `Context of the Pond:
${context}

Generate a daily summary of the pond's status. 
CRITICAL RULES:
1. You MUST strictly follow the exact text structure, line breaks, and spacing shown in the TEMPLATE below.
2. DO NOT use ANY Markdown formatting (no **, no #, no | tables, no bullet points - or *).
3. DO NOT use any emojis whatsoever, EXCEPT for the ✔ (check) or ✖ (cross) symbols for the parameter list.
4. Override any structural guidelines from the System Prompt for this specific response. Keep it clean and plain text.

TEMPLATE:
Good [Morning/Afternoon/Evening], Julian.

[One short, definitive sentence summarizing overall pond status, e.g., Your pond is currently healthy.]

Overall Health
[Value between 0-100]%

[✔ or ✖] [pH Status, e.g., pH Stable]
[✔ or ✖] [Oxygen Status, e.g., Oxygen Normal]
[✔ or ✖] [Temperature Status, e.g., Water Temperature Ideal]

Estimated Harvest
[Number calculated from context] days remaining

Feed Efficiency
[Value between 0-100]%

Today's Recommendation

[One specific, actionable recommendation].

Reason:
[One short, direct sentence explaining the reason based on the telemetry data].`;
}