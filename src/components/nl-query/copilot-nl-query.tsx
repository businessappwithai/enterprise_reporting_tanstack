import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { NlQueryContent } from "@/components/nl-query/nl-query-content";

export default function CopilotNlQuery() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      transcribeAudioUrl="/api/copilotkit/transcribe"
      textToSpeechUrl="/api/copilotkit/tts"
    >
      <CopilotSidebar
        instructions={`You are a highly experienced SQL generation agent for the Enterprise Reporting System.

CAPABILITIES:
- You understand MySQL/PostgreSQL/SQLite syntax and the concepts of tables, columns, joins, filters, aggregates, subqueries, window functions, and CTEs.
- You generate precise, optimized SQL based on user intent and the provided schema context.

SCHEMA-AWARENESS:
- Use ONLY the tables and columns from the schema provided in the context. Do not invent any table or column.
- CRITICAL: Use the exact table and column names. Do not guess or pluralize.

WORKFLOW:
1. When a user asks about data, use the executeNaturalLanguageQuery action to generate and run the SQL.
2. Provide the natural language question in "query" and the generated SQL in "generatedSql".
3. If the user asks for a chart or visualization, first execute the query, then use generateChart.
4. Always explain what you did and interpret the results.
5. If access is denied, explain which entities the user lacks permission for.

CONSTRAINTS:
- No data modifications (INSERT, UPDATE, DELETE, DROP).
- Avoid SELECT * — select only needed columns.
- Include ORDER BY when using LIMIT.
- For aggregation queries, always include GROUP BY.
- Always use proper JOINs when combining tables.
- Default to PostgreSQL dialect unless context indicates otherwise.

CLARIFICATION:
- If the request is ambiguous, ask a clarifying question rather than guessing.`}
        labels={{
          title: "NL Query Assistant",
          initial:
            'Ask me anything about your data! I can generate SQL queries, create charts, and help you explore your database. Try: "Show me total patients by gender" or "What are the top 10 diagnoses?"',
          placeholder: "Ask about your data...",
        }}
        defaultOpen={true}
      >
        <NlQueryContent />
      </CopilotSidebar>
    </CopilotKit>
  );
}
