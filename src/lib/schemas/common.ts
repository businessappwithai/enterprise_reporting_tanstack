import { z } from "zod";

export const uuidSchema = z.string().uuid("Invalid UUID format");

/**
 * An identifier for a row that may be one the application did not generate.
 *
 * The bootstrap accounts and roles have fixed ids that are not UUIDs — the administrator
 * is `1aa00cc2af0225000c5c114df3eebb69`, the roles are `admin-role-id` and
 * `nlquery0role00000000000000000000` — so a `uuidSchema` on a user or role id refused them:
 * the built-in NLQueryUser role could never be assigned, and the built-in accounts could not
 * be edited at all. Found by QA through the Users page. Everything the application itself
 * creates is still a UUID and keeps `uuidSchema`.
 */
export const idSchema = z.string().min(1, "An id is required").max(255, "Id too long");
export const emailSchema = z.string().email("Invalid email format").toLowerCase();
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters");
export const pageSchema = z.number().int().min(0, "Page must be non-negative").default(0);
export const pageSizeSchema = z
  .number()
  .int()
  .min(1, "Page size must be at least 1")
  .max(1000, "Page size cannot exceed 1000")
  .default(20);

export const paginationSchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
});

export const limitOffsetSchema = z.object({
  limit: z.number().int().positive().max(1000).optional(),
  offset: z.number().int().nonnegative().default(0),
});
