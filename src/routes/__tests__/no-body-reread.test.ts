import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { Glob } from "bun";

/**
 * A request body can be read once. A `catch` that calls request.json() again throws on a
 * body the try already consumed, so an error in the handler raises a second error inside
 * the error handler and the request never gets a response. That is how every SQL error —
 * a typo in a table name — hung the SQL Editor until the client gave up.
 *
 * Read the body once, before the try, and keep what the catch needs in a variable.
 */
describe("route handlers", () => {
  it("never read the request body inside a catch block", () => {
    const offenders: string[] = [];
    for (const dir of ["src/routes", "src/server-fns"]) {
      for (const file of new Glob("**/*.{ts,tsx}").scanSync(dir)) {
        if (file.includes("__tests__")) continue;
        const source = readFileSync(`${dir}/${file}`, "utf8");
        for (const match of source.matchAll(/catch\s*(?:\([^)]*\))?\s*\{/g)) {
          let depth = 1;
          let i = (match.index ?? 0) + match[0].length;
          const start = i;
          while (i < source.length && depth > 0) {
            if (source[i] === "{") depth++;
            else if (source[i] === "}") depth--;
            i++;
          }
          if (/request\.(json|text|formData|arrayBuffer)\(\)/.test(source.slice(start, i))) {
            offenders.push(`${dir}/${file}:${source.slice(0, match.index).split("\n").length}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
