/**
 * Preloaded by `bun test` (see bunfig.toml).
 *
 * `lib/auth/better-auth.ts` refuses to load without an AUTH_SECRET of 32+ characters, and several
 * tests import code that reaches it (the session lookup, and the workers through the access check).
 * They passed on a developer machine because `.env` supplied one, and errored on a fresh checkout,
 * where `.env` is gitignored. A test run should not depend on a secret that is not in the
 * repository, so a throwaway one is supplied - only when the environment has no usable one, so a
 * real value is never overridden. It is not a credential: nothing here signs a real session.
 */
const secret = process.env.AUTH_SECRET;
if (!secret || secret.length < 32) {
  process.env.AUTH_SECRET = "test-only-secret-not-a-credential-0123456789";
}
