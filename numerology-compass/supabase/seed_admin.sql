-- Script to create admin users
-- Run this after Supabase is set up and migrations are applied

-- Note: This should be run manually in Supabase SQL Editor or via Supabase CLI
-- First create users via Supabase Dashboard (Authentication > Users > Add User)

-- ============================================
-- ADMIN USER 1: victor@victor.ro / victor
-- ============================================
-- Steps:
-- 1. Go to Authentication > Users > Add User
-- 2. Email: victor@victor.ro
-- 3. Password: victor
-- 4. Auto Confirm User: ✅ (check this)
-- 5. After user is created, run the UPDATE below:

UPDATE public.users 
SET role = 'admin', name = 'Victor'
WHERE email = 'victor@victor.ro';

-- ============================================
-- ADMIN USER 2: vict0r@admin.local / Vict0r (legacy)
-- ============================================
-- Steps:
-- 1. Go to Authentication > Users > Add User
-- 2. Email: vict0r@admin.local
-- 3. Password: Vict0r
-- 4. Auto Confirm User: ✅ (check this)
-- 5. After user is created, run the UPDATE below:

UPDATE public.users 
SET role = 'admin', name = 'Vict0r'
WHERE email = 'vict0r@admin.local' OR (email LIKE '%vict0r%' AND email LIKE '%admin%');

-- ============================================
-- VERIFY ALL ADMIN USERS
-- ============================================
SELECT 
  id, 
  email, 
  name, 
  role, 
  created_at,
  CASE WHEN role = 'admin' THEN '✅ Admin' ELSE '❌ User' END as status
FROM public.users 
WHERE role = 'admin'
ORDER BY created_at DESC;
