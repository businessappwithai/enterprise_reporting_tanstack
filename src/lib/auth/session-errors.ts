/**
 * The outage message, in a module with no imports so the route's error component can
 * read it without pulling session.ts — and with it pg and Better Auth — into the
 * client bundle.
 */
export const SESSION_UNAVAILABLE_MESSAGE =
  "The session could not be checked: the server could not reach its database.";
