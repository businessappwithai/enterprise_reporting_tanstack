import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/nl-query/voice")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ success: false, error: "Unauthorized" }, { status: 401 });
          }

          const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
          const whisperModel = process.env.OLLAMA_WHISPER_MODEL || "dimavz/whisper-tiny";

          // Parse audio from the incoming multipart/form-data
          let formData: FormData;
          try {
            formData = await request.formData();
          } catch {
            return json({ success: false, error: "Expected multipart/form-data with audio field" });
          }

          const audioEntry = formData.get("audio");
          if (!audioEntry || !(audioEntry instanceof Blob)) {
            return json({ success: false, error: "No audio data in request" });
          }

          // Forward to Ollama's OpenAI-compatible transcription endpoint
          const ollamaForm = new FormData();
          ollamaForm.append("file", audioEntry, (audioEntry as File).name || "recording.webm");
          ollamaForm.append("model", whisperModel);
          ollamaForm.append("response_format", "json");

          const ollamaResponse = await fetch(`${ollamaUrl}/v1/audio/transcriptions`, {
            method: "POST",
            body: ollamaForm,
            signal: AbortSignal.timeout(30000),
          });

          if (!ollamaResponse.ok) {
            const errText = await ollamaResponse.text().catch(() => "");
            console.error("[Voice] Ollama transcription error:", ollamaResponse.status, errText);
            return json({
              success: false,
              error: `Transcription failed (${ollamaResponse.status}). Ensure dimavz/whisper-tiny is installed: ollama pull dimavz/whisper-tiny`,
            });
          }

          const data = (await ollamaResponse.json()) as { text?: string };
          const text = (data.text ?? "").trim();

          if (!text) {
            return json({ success: false, error: "No speech detected — try speaking more clearly" });
          }

          return json({ success: true, text });
        } catch (error) {
          console.error("[Voice] Error:", error);
          const msg = error instanceof Error ? error.message : "Transcription failed";
          return json({ success: false, error: msg });
        }
      },
    },
  },
});
