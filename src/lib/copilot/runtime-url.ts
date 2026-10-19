import { toast } from "sonner";

/**
 * The URL every `<CopilotKit runtimeUrl>` in this application points at.
 *
 * It has to be absolute in the browser. The runtime answers the client's probe with
 * `singleRoute.resourceOperations`, after which the client rewrites each follow-up
 * request by calling `new URL(runtimeUrl)` — which throws for a relative `/api/…`.
 * The probe itself works with a relative URL, so the symptom is not a failed connection
 * but, on every page that mounts the assistant, an "Invalid URL" error from the first
 * agent run and a chat that never answers. Found by QA, in `@copilotkit/core` 1.71.
 *
 * On the server there is no `window`, and nothing reads the value there: the client
 * connects from an effect.
 */
const RUNTIME_PATH = "/api/copilotkit";

export function copilotRuntimeUrl(): string {
  if (typeof window === "undefined") return RUNTIME_PATH;
  return new URL(RUNTIME_PATH, window.location.origin).href;
}

/**
 * What a person sees when the assistant fails.
 *
 * Without this the chat just stops: the message they typed stays on screen, nothing
 * answers, and the reason is a line in the browser console. The usual cause is not a
 * bug but the AI service being unreachable, and that is worth saying in words — without
 * the connection string and stack the raw error carries. The fixed toast id means the
 * client's three retries replace one message instead of stacking three.
 */
export function onCopilotError(event: { error?: unknown; code?: string }): void {
  const detail = event.error instanceof Error ? event.error.message : String(event.error ?? "");
  const unreachable = /ECONNREFUSED|ENOTFOUND|Cannot connect|fetch failed|Failed after \d+ attempts/i.test(
    detail
  );
  toast.error(
    unreachable
      ? "The AI assistant's service isn't reachable right now. Please try again shortly, or contact your administrator if it continues."
      : "The assistant hit an error and could not answer. Please try again.",
    { id: "copilot-error" }
  );
}
