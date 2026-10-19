/**
 * Where to send someone after they sign in, when the link that brought them to the login
 * page asked for a particular place (`/login?redirect=/share/dashboard/…`).
 *
 * The value comes from a URL anyone can craft, so only a path on this site is honoured.
 * `//evil.example` and `/\evil.example` look relative and are not — a browser resolves
 * both to another origin — and a `javascript:` or absolute URL is not a path at all.
 * Anything else returns null and the caller uses its default.
 */
export function safeRedirectTarget(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (raw.length > 2048) return null;
  if (!raw.startsWith("/")) return null;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return null;
  // eslint-disable-next-line no-control-regex -- control characters and whitespace tricks
  if (/[\u0000-\u001f\u007f]/.test(raw)) return null;
  if (raw === "/login" || raw.startsWith("/login?") || raw.startsWith("/login/")) return null;
  return raw;
}
