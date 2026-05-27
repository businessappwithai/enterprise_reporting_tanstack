import OpenAI from "openai";

const LLAMA_STT_URL = process.env.LLAMA_STT_URL || "http://localhost:8081";
const LLAMA_REASONING_URL = process.env.LLAMA_REASONING_URL || "http://localhost:8080";
const LLAMA_TTS_URL = process.env.LLAMA_TTS_URL || "http://localhost:8083";

export function createSttClient() {
  return new OpenAI({
    baseURL: `${LLAMA_STT_URL}/v1`,
    apiKey: "none",
  });
}

export function createReasoningClient() {
  return new OpenAI({
    baseURL: `${LLAMA_REASONING_URL}/v1`,
    apiKey: "none",
  });
}

export function createTtsClient() {
  return new OpenAI({
    baseURL: `${LLAMA_TTS_URL}/v1`,
    apiKey: "none",
  });
}

export async function isLlamaSttAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${LLAMA_STT_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function isLlamaReasoningAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${LLAMA_REASONING_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function isLlamaTtsAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${LLAMA_TTS_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}
