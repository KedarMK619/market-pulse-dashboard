import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  PULSE_AI_SYSTEM_PROMPT,
  buildGeminiPrompt,
  buildLocalMarketSummary,
  generateLocalPulseResponse,
  type MarketContextInput,
} from "./pulseKnowledge";

const PLACEHOLDER_KEY = "your_key_here";

function getGeminiApiKey(): string | null {
  const key = import.meta.env?.VITE_GEMINI_API_KEY;
  if (!key || typeof key !== "string") return null;
  const trimmed = key.trim();
  if (!trimmed || trimmed === PLACEHOLDER_KEY) return null;
  return trimmed;
}

function getGeminiModelName(): string {
  const configured = import.meta.env?.VITE_GEMINI_MODEL;
  return typeof configured === "string" && configured.trim()
    ? configured.trim()
    : "gemini-2.0-flash";
}

async function sleepIfInteractive(ms: number): Promise<void> {
  if (import.meta.env?.MODE === "test") return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Analyzes a user question using Gemini AI (when VITE_GEMINI_API_KEY is configured)
 * with automatic fallback to the trained local PulseAI knowledge engine.
 */
export async function analyzeMarket(
  userQuestion: string,
  marketContext: MarketContextInput = {}
): Promise<string> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: getGeminiModelName(),
        systemInstruction: PULSE_AI_SYSTEM_PROMPT,
      });

      const prompt = buildGeminiPrompt(userQuestion, marketContext);
      const result = await model.generateContent(prompt);
      const text = result.response.text()?.trim();

      if (text) {
        return text;
      }
    } catch (error) {
      console.warn("Gemini API unavailable, falling back to local PulseAI engine:", error);
    }
  }

  await sleepIfInteractive(450);
  return generateLocalPulseResponse(userQuestion, marketContext);
}

/**
 * Generates a concise daily market summary for Dashboard and Market Feed.
 */
export async function generateMarketSummary(
  marketData: MarketContextInput = {}
): Promise<string> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: getGeminiModelName(),
        systemInstruction: PULSE_AI_SYSTEM_PROMPT,
      });

      const prompt = buildGeminiPrompt(
        "Provide a concise 3-sentence daily market summary covering market breadth, top/bottom sectors, top gainer/loser, and leading product demand. End with: ⚠️ Educational analysis only. Not financial advice.",
        marketData
      );
      const result = await model.generateContent(prompt);
      const text = result.response.text()?.trim();

      if (text) {
        return text;
      }
    } catch (error) {
      console.warn("Gemini summary unavailable, falling back to local summary:", error);
    }
  }

  await sleepIfInteractive(350);
  return buildLocalMarketSummary(marketData);
}
