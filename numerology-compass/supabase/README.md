# Supabase Setup pentru Numerology Compass

## Pași de Setup

### 1. Configurare Supabase Project

1. Creează un proiect nou pe [Supabase](https://supabase.com)
2. Notează URL-ul proiectului și anon key-ul
3. Adaugă în `.env.local` (creează fișierul dacă nu există):
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 2. Aplicare Migrations

1. Deschide Supabase Dashboard > SQL Editor
2. Rulează conținutul din `migrations/001_initial_schema.sql`
3. Verifică că tabelele `users` și `profiles` au fost create

### 3. Creare Admin Users

**Admin User 1: victor@victor.ro / victor (Recomandat)**

1. Mergi la Authentication > Users
2. Click "Add User" > "Create new user"
3. Completează:
   - Email: `victor@victor.ro`
   - Password: `victor`
   - Auto Confirm User: ✅ (bifează)
4. După creare, mergi la SQL Editor și rulează:
```sql
UPDATE public.users 
SET role = 'admin', name = 'Victor'
WHERE email = 'victor@victor.ro';
```

**Admin User 2: vict0r@admin.local / Vict0r (Legacy)**

1. Mergi la Authentication > Users
2. Click "Add User" > "Create new user"
3. Completează:
   - Email: `vict0r@admin.local`
   - Password: `Vict0r`
   - Auto Confirm User: ✅ (bifează)
4. După creare, mergi la SQL Editor și rulează:
```sql
UPDATE public.users 
SET role = 'admin', name = 'Vict0r'
WHERE email = 'vict0r@admin.local';
```

**Sau folosește scriptul complet:**
- Rulează conținutul din `seed_admin.sql` în SQL Editor (după ce ai creat userii în Dashboard)

### 4. Verificare Setup

1. Pornește aplicația: `npm run dev`
2. Mergi la `/auth`
3. Încearcă să te loghezi cu:
   - Email: `victor@victor.ro`
   - Password: `victor`
4. Dacă funcționează, backend-ul este configurat corect!

## Structura Bazei de Date

### Tabel `users`
- `id` (UUID) - Referință la `auth.users(id)`
- `email` (TEXT) - Email-ul utilizatorului
- `name` (TEXT) - Numele complet
- `role` (TEXT) - 'user' sau 'admin'
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Tabel `profiles`
- `id` (UUID) - ID unic profil
- `user_id` (UUID) - Referință la `users(id)`
- `full_name` (TEXT) - Numele complet pentru calcul
- `birth_date` (DATE) - Data nașterii
- `life_path`, `destiny`, `soul_urge`, `personality`, `personal_year` (INTEGER) - Numere calculate
- `created_at`, `updated_at` (TIMESTAMPTZ)

## Row Level Security (RLS)

- Utilizatorii pot citi/actualiza doar propriile date
- Adminii pot citi toți utilizatorii
- Profilurile sunt private pentru fiecare utilizator

## Funcții Utile

### Verificare User Admin
```typescript
const { isAdmin } = useAuth();
if (isAdmin) {
  // Do admin stuff
}
```

### Creare Profil Numerologic
```typescript
const { data, error } = await supabase
  .from('profiles')
  .insert({
    user_id: user.id,
    full_name: 'John Doe',
    birth_date: '1990-01-01',
    life_path: 5,
    destiny: 7,
    // ... etc
  });
```

## Troubleshooting

**Eroare: "relation 'public.users' does not exist"**
- Rulează migration-ul `001_initial_schema.sql` în SQL Editor

**Eroare: "new row violates row-level security policy"**
- Verifică că RLS policies sunt create corect
- Verifică că utilizatorul este autentificat

**User-ul nu apare în `public.users` după signup**
- Verifică că trigger-ul `on_auth_user_created` este activ
- Verifică logs-urile în Supabase Dashboard > Logs

