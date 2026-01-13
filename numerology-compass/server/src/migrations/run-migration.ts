import pool from '../db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Running migration: 002_create_user_profiles.sql');
    
    const migrationPath = join(__dirname, '002_create_user_profiles.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    await client.query('BEGIN');
    await client.query(migrationSQL);
    await client.query('COMMIT');
    
    console.log('✅ Migration completed successfully!');
    
    // Verify table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
      );
    `);
    
    if (result.rows[0].exists) {
      console.log('✅ user_profiles table exists');
    } else {
      console.log('❌ user_profiles table does not exist');
    }
    
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    
    const pgError = error as { code?: string; message?: string };
    if (pgError.code === '42P07') {
      // Table already exists
      console.log('ℹ️  Table user_profiles already exists');
    } else {
      console.error('❌ Migration error:', pgError.message || 'Unknown error');
      console.error('Error details:', error);
      process.exit(1);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

