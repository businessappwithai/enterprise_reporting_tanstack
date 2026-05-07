import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add is_public column to report_definitions
  await knex.schema alteringTable('report_definitions', (table) => {
    table.boolean('is_public').defaultTo(false).notNullable();
  });

  // Add is_public column to chart_definitions
  await knex.schema.alterTable('chart_definitions', (table) => {
    table.boolean('is_public').defaultTo(false).notNullable();
  });

  // Add is_public column to dashboard_layouts if not exists
  const hasPublicColumn = await knex.schema.hasColumn('dashboard_layouts', 'is_public');
  if (!hasPublicColumn) {
    await knex.schema.alterTable('dashboard_layouts', (table) => {
      table.boolean('is_public').defaultTo(false).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('report_definitions', (table) => {
    table.dropColumn('is_public');
  });

  await knex.schema.alterTable('chart_definitions', (table) => {
    table.dropColumn('is_public');
  });

  await knex.schema.alterTable('dashboard_layouts', (table) => {
    table.dropColumn('is_public');
  });
}
