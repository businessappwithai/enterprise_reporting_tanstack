import { getDb } from './src/lib/db/config';

const db = getDb();
const ds = await db.selectFrom('data_sources')
  .select(['id', 'name', 'client_type', 'is_active', 'connection_config'])
  .where('name', '=', 'HMS')
  .executeTakeFirst();

if (ds) {
  console.log('=== HMS Data Source ===');
  console.log('ID:', ds.id);
  console.log('Name:', ds.name);
  console.log('Type:', ds.client_type);
  console.log('Active:', ds.is_active);
  console.log('\nConnection Config (first 300 chars):');
  console.log(String(ds.connection_config).substring(0, 300));

  // Try to parse
  try {
    const config = JSON.parse(String(ds.connection_config));
    console.log('\nConnection Config (parsed):');
    console.log(JSON.stringify(config, null, 2));
  } catch (e) {
    console.log('\nFailed to parse as JSON (might be encrypted)');
    console.log('Config length:', String(ds.connection_config).length);
  }
} else {
  console.log('HMS not found');
}
