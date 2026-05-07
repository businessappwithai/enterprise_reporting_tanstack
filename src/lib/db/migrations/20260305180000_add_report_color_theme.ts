import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add color_theme column to report_definitions
  await knex.schema.alterTable('report_definitions', (table) => {
    table.text('color_theme').nullable();
  });

  // Add color_theme column to chart_definitions for consistency
  await knex.schema.alterTable('chart_definitions', (table) => {
    table.text('color_theme').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('report_definitions', (table) => {
    table.dropColumn('color_theme');
  });

  await knex.schema.alterTable('chart_definitions', (table) => {
    table.dropColumn('color_theme');
  });
}
