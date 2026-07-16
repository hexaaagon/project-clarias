import { OpenRouter } from "@openrouter/sdk";

const apiKey = process.env.OPENROUTER_API_KEY;

/**
 * Singleton client for OpenRouter SDK API interactions.
 * If key is missing, instantiates with a mock key to prevent build-time failures.
 */
export const openrouter = new OpenRouter({
  apiKey: apiKey || "mock-key",
});

/**
 * Configured fallback model for OpenRouter completions.
 */
export const DEFAULT_OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b";
