import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { requireAuth } from "@/lib/auth/middleware";
import { runADKPipeline } from "@/lib/adk/pipeline";
import { logAudit } from "@/lib/security/audit";
import { AUDIT_ACTIONS } from "@/types/actions";

export const APIRoute = createAPIFileRoute("/api/adk/analyze-intent")({
  POST: async ({ request }) => {
    try {
      const session = await requireAuth();

      const body = await request.json() as {
        nlRequest?: string;
        dataSourceId?: string;
        sessionId?: string;
      };

      if (!body.nlRequest?.trim()) {
        return json({ error: "nlRequest is required and must be non-empty" }, { status: 400 });
      }

      if (!body.dataSourceId) {
        return json({ error: "dataSourceId is required" }, { status: 400 });
      }

      await logAudit({
        userId: session.user.id,
        action: AUDIT_ACTIONS.ADK.INTENT_RECEIVED,
        resourceType: "adk_intent" as any,
        details: { dataSourceId: body.dataSourceId, requestLength: body.nlRequest.length },
      });

      const result = await runADKPipeline(
        body.nlRequest.trim(),
        session.user.id,
        body.dataSourceId,
        body.sessionId,
      );

      return json(result, { status: result.success ? 200 : result.clarificationNeeded ? 200 : 422 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "ADK pipeline failed";
      console.error("[/api/adk/analyze-intent]", err);
      return json(
        { success: false, error: msg },
        { status: err instanceof Error && err.message.includes("Unauthorized") ? 401 : 500 }
      );
    }
  },
});
