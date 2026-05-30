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
    const baseURL = process.env.MASTRA_URL || "http://localhost:4111";
    const apiKey = process.env.LLAMA_REASONING_API_KEY || "none";
    const model = process.env.LLAMA_REASONING_MODEL || "qwen3.6";

    const openai = new OpenAI({
      baseURL: `${baseURL}/v1`,
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

export const Route = createFileRoute("/api/copilotkit/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return getHandler().handleRequest(request);
      },
      POST: async ({ request }) => {
        return getHandler().handleRequest(request);
      },
    },
  },
});
