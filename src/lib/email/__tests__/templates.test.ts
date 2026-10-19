import { describe, expect, it } from "bun:test";
import { escapeHtml, renderTemplate } from "../email-service";
import {
  emailTemplateInputSchema,
  placeholdersIn,
  toEmailTemplate,
  variablesForRow,
} from "../templates";

describe("renderTemplate", () => {
  it("escapes values in an HTML body, so a database value cannot become markup", () => {
    const out = renderTemplate("<p>Hello {{name}}</p>", {
      name: '<a href="https://evil.example">click</a>',
    });
    expect(out).toBe(
      "<p>Hello &lt;a href=&quot;https://evil.example&quot;&gt;click&lt;/a&gt;</p>"
    );
  });

  it("leaves a plain-text subject unescaped", () => {
    expect(renderTemplate("Q&A for {{name}}", { name: "Tom & Jerry" }, null, { html: false })).toBe(
      "Q&A for Tom & Jerry"
    );
  });

  it("does not let a dollar sign in a value rewrite itself", () => {
    // String.replace with a replacement string reads $& as "the match".
    expect(renderTemplate("Total: {{amount}}", { amount: "$& and $$" })).toBe("Total: $&amp; and $$");
    expect(renderTemplate("{{a}}", { a: "$1" }, null, { html: false })).toBe("$1");
  });

  it("leaves an unknown placeholder visible rather than blanking it", () => {
    expect(renderTemplate("Hi {{unknown}}", {})).toBe("Hi {{unknown}}");
  });

  it("drops a conditional block when its value is falsy, and keeps it when truthy", () => {
    const t = "A{{#if x}} [{{x}}]{{/if}}B";
    expect(renderTemplate(t, { x: "" })).toBe("AB");
    expect(renderTemplate(t, { x: "1" })).toBe("A [1]B");
  });

  it("falls back to a column of the first result row and escapes the results table", () => {
    const rows = [{ city: "<b>Pune</b>", n: 3 }];
    expect(renderTemplate("{{city}}", {}, rows)).toBe("&lt;b&gt;Pune&lt;/b&gt;");
    expect(renderTemplate("{{queryResults}}", {}, rows)).toContain("<td>&lt;b&gt;Pune&lt;/b&gt;</td>");
  });

  it("escapeHtml covers the five characters", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });
});

describe("template helpers", () => {
  it("maps a row through the placeholder-to-column mappings, as the batch worker does", () => {
    const vars = variablesForRow(
      { firstName: "first_name", total: "order_total" },
      { first_name: "Asha", order_total: 120, unrelated: "x" },
      { index: 2, total: 9 }
    );
    expect(vars.firstName).toBe("Asha");
    expect(vars.total).toBe(120);
    expect(vars.unrelated).toBeUndefined();
    expect(vars._recipientNumber).toBe(3);
    expect(vars._totalRecipients).toBe(9);
  });

  it("finds placeholders once each, and not block helpers", () => {
    expect(placeholdersIn("{{a}} {{b}} {{a}} {{#if c}}x{{/if}}")).toEqual(["a", "b"]);
  });

  it("reads a stored row back in the shape the UI uses", () => {
    const t = toEmailTemplate({
      id: "t1",
      name: "N",
      subject: "S",
      body: "<p>fallback</p>",
      html_body: null,
      column_mappings: '{"a":"col_a"}',
      query_id: null,
      created_by: null,
      created_at: "c",
      updated_at: "u",
    });
    expect(t.htmlBody).toBe("<p>fallback</p>");
    expect(t.columnMappings).toEqual({ a: "col_a" });
    expect(t.queryId).toBeUndefined();
  });

  it("survives malformed stored mappings", () => {
    const row = { id: "t", name: "n", subject: "s", body: "b", html_body: "b", query_id: null, created_by: null, created_at: "", updated_at: "" };
    expect(toEmailTemplate({ ...row, column_mappings: "not json" }).columnMappings).toEqual({});
    expect(toEmailTemplate({ ...row, column_mappings: "[1,2]" }).columnMappings).toEqual({});
  });

  it("validates input: required fields, and placeholder names", () => {
    expect(emailTemplateInputSchema.safeParse({ name: "", subject: "s", htmlBody: "b" }).success).toBe(false);
    expect(
      emailTemplateInputSchema.safeParse({
        name: "n",
        subject: "s",
        htmlBody: "b",
        columnMappings: { "bad name": "col" },
      }).success
    ).toBe(false);
    const ok = emailTemplateInputSchema.safeParse({ name: " n ", subject: "s", htmlBody: "b", queryId: null });
    expect(ok.success && ok.data.name).toBe("n");
  });
});
