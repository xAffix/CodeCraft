/**
 * Database migration runner.
 * Reads the SQL migration file and executes it against Supabase.
 *
 * Usage: node src/migrations/run.js
 *
 * NOTE: For Phase 1, this prints the SQL to the console.
 * The actual migration should be run in the Supabase SQL Editor
 * (Dashboard > SQL Editor) since Supabase REST API doesn't
 * support raw SQL execution with anon key.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const migrationFile = path.join(__dirname, '001_schema.sql');

console.log('╔════════════════════════════════════════════════════╗');
console.log('║          CodeCraft Database Migration             ║');
console('╚════════════════════════════════════════════════════╝\n');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.log('⚠️  SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const sql = fs.readFileSync(migrationFile, 'utf-8');

console.log(`📄 Migration file: ${migrationFile}`);
console.log(`📊 Size: ${sql.length} characters\n`);
console.log('📋 SQL to execute:\n');
console.log('─'.repeat(60));
console.log(sql);
console.log('─'.repeat(60));
console.log('\n❕ Run this SQL in Supabase SQL Editor:');
console.log(`   ${process.env.SUPABASE_URL}/project/sql/new\n`);
console.log('Or use the Supabase CLI:');
console.log('   supabase db push\n');

// Count statements for display
const statements = sql.split(';').filter(s => s.trim().length > 0);
console.log(`📦 ${statements.length} SQL statements ready to execute.\n`);
console.log('✅ Migration file ready.');
