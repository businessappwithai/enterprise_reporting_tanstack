import type { Knex } from "knex";

export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable("data_sources", (table: any) => {
    table.timestamp("last_inspected_at").nullable().defaultTo(null);
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.alterTable("data_sources", (table: any) => {
    table.dropColumn("last_inspected_at");
  });
}
