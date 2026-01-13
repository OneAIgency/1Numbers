-- Quick script to create admin user: victor@victor.ro / victor
-- Run this in Supabase SQL Editor AFTER creating the user in Authentication > Users

-- Step 1: Create user in Supabase Dashboard
-- Go to: Authentication > Users > Add User
-- Email: victor@victor.ro
-- Password: victor
-- Auto Confirm User: ✅ (IMPORTANT: check this box)

-- Step 2: After user is created, run this SQL:
UPDATE public.users 
SET role = 'admin', name = 'Victor'
WHERE email = 'victor@victor.ro';

-- Step 3: Verify the admin user was created
SELECT 
  id, 
  email, 
  name, 
  role, 
  created_at,
  CASE WHEN role = 'admin' THEN '✅ Admin' ELSE '❌ User' END as status
FROM public.users 
WHERE email = 'victor@victor.ro';

