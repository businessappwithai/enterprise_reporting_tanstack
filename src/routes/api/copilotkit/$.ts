import { createFileRoute } from "@tanstack/react-router";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";

class OpenAIChatAdapter extends OpenAIAdapter {
  private _chatModel: string;
  private _chatBaseURL: string;
  private _chatApiKey: string;

  constructor(params: { openai: OpenAI; model: string }) {
    super(params);
    this._chatModel = params.model;
    this._chatBaseURL = params.openai.baseURL;
    this._chatApiKey = params.openai.apiKey as string;
  }

  getLanguageModel() {
    const provider = createOpenAI({
      baseURL: this._chatBaseURL,
      apiKey: this._chatApiKey,
    });
    return provider.chat(this._chatModel);
  }
}

let _handler: { handleRequest: (req: Request) => Response | Promise<Response> } | null = null;

function getHandler() {
  if (!_handler) {
    const mastraUrl = process.env.MASTRA_URL || "http://localhost:4111";
    const apiKey = process.env.LLAMA_REASONING_API_KEY || "none";
    const model = process.env.LLAMA_REASONING_MODEL || "qwen3.6";

    const openai = new OpenAI({
      baseURL: `${mastraUrl}/v1`,
      apiKey,
    });

    const runtime = new CopilotRuntime();
    _handler = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter: new OpenAIChatAdapter({ openai, model }),
      endpoint: "/api/copilotkit",
    });
  }
  return _handler;
}

async function handleTranscribe(request: Request): Promise<Response> {
  const mastraUrl = process.env.MASTRA_URL || "http://localhost:4111";
  try {
    const formData = await request.formData();
    const audioFile = formData.get("file") || formData.get("audio");
    if (!audioFile || !(audioFile instanceof Blob)) {
      return new Response(
        JSON.stringify({ error: "No audio file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const proxyForm = new FormData();
    proxyForm.append("file", audioFile, "audio.wav");
    proxyForm.append("response_format", "json");

    const res = await fetch(`${mastraUrl}/v1/audio/transcriptions`, {
      method: "POST",
      body: proxyForm,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[CopilotKit Transcribe] Mastra STT error:", errText);
      return new Response(
        JSON.stringify({ error: `Transcription failed: ${errText}` }),
        { status: res.status, headers: { "Content-Type": "application/json" } },
      );
    }

    const result = await res.json();
    const text = (result.text || "").trim();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "No speech detected" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ text }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[CopilotKit Transcribe] Error:", error);
    const msg = error instanceof Error ? error.message : "Transcription failed";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}

async function handleTts(request: Request): Promise<Response> {
  const mastraUrl = process.env.MASTRA_URL || "http://localhost:4111";
  try {
    const body = await request.json();

    const res = await fetch(`${mastraUrl}/v1/audio/speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(
        JSON.stringify({ error: `TTS failed: ${errText}` }),
        { status: res.status, headers: { "Content-Type": "application/json" } },
      );
    }

    const audioData = await res.arrayBuffer();
    return new Response(audioData, {
      status: 200,
      headers: { "Content-Type": res.headers.get("Content-Type") || "audio/mpeg" },
    });
  } catch (error) {
    console.error("[CopilotKit TTS] Error:", error);
    return new Response(
      JSON.stringify({ error: "TTS service unavailable" }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }
}

export const Route = createFileRoute("/api/copilotkit/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        if (url.pathname.includes("/threads")) {
          return new Response(JSON.stringify({ threads: [] }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return getHandler().handleRequest(request);
      },
      POST: async ({ request }) => {
        const url = new URL(request.url);
        if (url.pathname.endsWith("/transcribe")) {
          return handleTranscribe(request);
        }
        if (url.pathname.endsWith("/tts")) {
          return handleTts(request);
        }
        if (url.pathname.includes("/threads")) {
          return new Response(JSON.stringify({ threadId: crypto.randomUUID() }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return getHandler().handleRequest(request);
      },
    },
  },
});
