# Setup Admin User - Quick Guide

## Opțiunea 1: Script Automat (Recomandat)

### Pași:

1. **Configurează variabilele de mediu în `.env.local`:**
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

2. **Obține Service Role Key:**
   - Mergi la Supabase Dashboard > Settings > API
   - Copiază "service_role" key (NU anon key!)
   - ⚠️ **IMPORTANT:** Service Role Key are acces admin complet. Nu-l partaja niciodată!

3. **Rulează scriptul:**
```bash
npm run create-admin-user
```

Scriptul va:
- ✅ Crea user-ul în `auth.users`
- ✅ Setează rolul admin în `public.users`
- ✅ Verifică că totul funcționează

## Opțiunea 2: Manual (Via Dashboard)

1. Mergi la Supabase Dashboard > Authentication > Users
2. Click "Add User" > "Create new user"
3. Completează:
   - Email: `victor@victor.ro`
   - Password: `victor`
   - Auto Confirm User: ✅
4. Mergi la SQL Editor și rulează:
```sql
UPDATE public.users 
SET role = 'admin', name = 'Victor'
WHERE email = 'victor@victor.ro';
```

## Verificare

După crearea user-ului, testează login-ul:
- Email: `victor@victor.ro`
- Password: `victor`

Dacă funcționează, user-ul admin este creat cu succes! 🎉

