#!/usr/bin/env node

/**
 * Script to create admin user: victor@victor.ro / victor
 * 
 * Usage:
 *   npm run create-admin-user
 *   or
 *   node supabase/create-admin-user.js
 * 
 * Requirements:
 *   - Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - Get Service Role Key from Supabase Dashboard > Settings > API
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  try {
    const envFile = readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      }
    });
  } catch (e) {
    // Ignore errors
  }
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Error: VITE_SUPABASE_URL or SUPABASE_URL not set');
  console.log('\nPlease set it in .env.local:');
  console.log('VITE_SUPABASE_URL=https://your-project.supabase.co');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not set');
  console.log('\nTo get your Service Role Key:');
  console.log('1. Go to Supabase Dashboard > Settings > API');
  console.log('2. Copy the "service_role" key (NOT the anon key)');
  console.log('3. Add it to .env.local:');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.log('\n⚠️  WARNING: Service Role Key has admin access. Keep it secret!');
  process.exit(1);
}

// Create admin client (with service role key for admin operations)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'victor@victor.ro';
const ADMIN_PASSWORD = 'victor';
const ADMIN_NAME = 'Victor';

async function createAdminUser() {
  console.log('🚀 Creating admin user...\n');
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log(`Name: ${ADMIN_NAME}\n`);

  try {
    // Step 1: Create auth user
    console.log('📝 Step 1: Creating auth user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: ADMIN_NAME,
        role: 'admin'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️  User already exists in auth.users, continuing...');
        // Get existing user
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users.find(u => u.email === ADMIN_EMAIL);
        if (!existingUser) {
          throw new Error('User exists but could not be found');
        }
        authData.user = existingUser;
      } else {
        throw authError;
      }
    }

    if (!authData.user) {
      throw new Error('Failed to create or find user');
    }

    console.log(`✅ Auth user created/found: ${authData.user.id}\n`);

    // Step 2: Wait a bit for trigger to create public.users record
    console.log('⏳ Waiting for trigger to create public.users record...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Update or create public.users record with admin role
    console.log('📝 Step 2: Setting admin role in public.users...');
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: authData.user.id,
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        role: 'admin'
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (userError) {
      // If upsert fails, try insert
      console.log('⚠️  Upsert failed, trying insert...');
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email: ADMIN_EMAIL,
          name: ADMIN_NAME,
          role: 'admin'
        });

      if (insertError) {
        throw insertError;
      }
      console.log('✅ User record created');
    } else {
      console.log(`✅ User record updated: ${userData?.email}`);
    }

    // Step 4: Verify
    console.log('\n📝 Step 3: Verifying admin user...');
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role, created_at')
      .eq('email', ADMIN_EMAIL)
      .single();

    if (verifyError) {
      throw verifyError;
    }

    console.log('\n✅ Admin user created successfully!\n');
    console.log('User Details:');
    console.log(`  ID: ${verifyData.id}`);
    console.log(`  Email: ${verifyData.email}`);
    console.log(`  Name: ${verifyData.name}`);
    console.log(`  Role: ${verifyData.role} ${verifyData.role === 'admin' ? '✅' : '❌'}`);
    console.log(`  Created: ${verifyData.created_at}\n`);

    console.log('🎉 You can now login with:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}\n`);

  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error(error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
    if (error.hint) {
      console.error('Hint:', error.hint);
    }
    process.exit(1);
  }
}

createAdminUser();

