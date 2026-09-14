import { describe, expect, test } from "bun:test";
import {
  buildRecordUrl,
  parseRecordLinkConfig,
  type RecordLinkConfig,
  serializeRecordLinkConfig,
  validateUrlTemplate,
} from "../record-link";

const base: RecordLinkConfig = {
  enabled: true,
  idColumn: "id",
  urlTemplate: "/app/bus_account/{id}",
};

describe("validateUrlTemplate", () => {
  test("accepts a site-relative template", () => {
    expect(validateUrlTemplate("/app/bus_account/{id}").ok).toBe(true);
  });

  test("accepts absolute http and https", () => {
    expect(validateUrlTemplate("https://crm.example.com/record/{id}").ok).toBe(true);
    expect(validateUrlTemplate("http://internal.example.com/record/{id}").ok).toBe(true);
  });

  test("requires the id placeholder", () => {
    const result = validateUrlTemplate("https://example.com/records");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("{id}");
  });

  test("rejects an empty template", () => {
    expect(validateUrlTemplate("   ").ok).toBe(false);
  });

  // The whole reason this module exists. An administrator configures the URL,
  // but the button is rendered for every viewer of the report — so a scheme
  // that executes is stored XSS, not just a bad link.
  describe("rejects schemes that execute or forge a document", () => {
    const dangerous = [
      "javascript:alert(1)/*{id}*/",
      "JavaScript:alert(1)/*{id}*/",
      "  javascript:alert(1)/*{id}*/",
      "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=={id}",
      "vbscript:msgbox(1){id}",
      "file:///etc/passwd/{id}",
    ];

    for (const template of dangerous) {
      test(template.trim().slice(0, 40), () => {
        expect(validateUrlTemplate(template).ok).toBe(false);
      });
    }
  });

  // `//evil.example.com/x` is an absolute URL to another origin that merely
  // looks relative. Accepting it as "site-relative" would send the record id
  // to a third party.
  test("rejects a protocol-relative URL", () => {
    const result = validateUrlTemplate("//evil.example.com/{id}");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("another site");
  });
});

describe("buildRecordUrl", () => {
  test("substitutes the id", () => {
    expect(buildRecordUrl(base, "42")).toBe("/app/bus_account/42");
  });

  test("URL-encodes the id rather than pasting it in raw", () => {
    // An id is data, not URL syntax. Without encoding, an id containing `?`,
    // `#` or `/` silently changes which record — or which endpoint — is opened.
    expect(buildRecordUrl(base, "a b/c?d#e")).toBe("/app/bus_account/a%20b%2Fc%3Fd%23e");
  });

  test("returns null when the link is disabled", () => {
    expect(buildRecordUrl({ ...base, enabled: false }, "42")).toBeNull();
  });

  test("returns null for an absent id", () => {
    expect(buildRecordUrl(base, null)).toBeNull();
    expect(buildRecordUrl(base, undefined)).toBeNull();
    expect(buildRecordUrl(base, "")).toBeNull();
  });

  // A row stored before this validation existed, or written by something other
  // than the UI, must not produce a live javascript: href.
  test("re-validates on read, so a stored bad template yields no URL", () => {
    expect(
      buildRecordUrl({ ...base, urlTemplate: "javascript:alert(1)/*{id}*/" }, "42")
    ).toBeNull();
  });
});

describe("parseRecordLinkConfig", () => {
  test("round-trips through serialize", () => {
    const config: RecordLinkConfig = {
      enabled: true,
      idColumn: "account_id",
      urlTemplate: "https://example.com/{id}",
      label: "Open in CRM",
      openInNewTab: false,
    };
    expect(parseRecordLinkConfig(serializeRecordLinkConfig(config))).toEqual(config);
  });

  test("defaults openInNewTab to true", () => {
    const parsed = parseRecordLinkConfig(
      JSON.stringify({ enabled: true, idColumn: "id", urlTemplate: "/x/{id}" })
    );
    expect(parsed?.openInNewTab).toBe(true);
  });

  // A malformed config must not break the record view it hangs off.
  test("reads malformed or absent JSON as no link", () => {
    expect(parseRecordLinkConfig(null)).toBeNull();
    expect(parseRecordLinkConfig("")).toBeNull();
    expect(parseRecordLinkConfig("not json")).toBeNull();
    expect(parseRecordLinkConfig("{}")).toBeNull();
    expect(parseRecordLinkConfig(JSON.stringify({ urlTemplate: 5, idColumn: "id" }))).toBeNull();
  });

  test("treats a missing enabled flag as disabled", () => {
    const parsed = parseRecordLinkConfig(
      JSON.stringify({ idColumn: "id", urlTemplate: "/x/{id}" })
    );
    expect(parsed?.enabled).toBe(false);
  });
});
