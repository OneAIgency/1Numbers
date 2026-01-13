# Scripts

## create-admin-user.js

Creates an admin user in the PostgreSQL database.

### Prerequisites

1. **PostgreSQL installed and running**
   - macOS: `brew install postgresql@14 && brew services start postgresql@14`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Database created**
   ```bash
   createdb numerology_compass
   ```

3. **Environment variables set**
   Create `.env.local` in the project root:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/numerology_compass
   ```
   
   Adjust the connection string based on your PostgreSQL setup:
   - `postgres` = default username
   - `postgres` = default password (change if you set a different one)
   - `localhost:5432` = default host and port
   - `numerology_compass` = database name

### Usage

```bash
npm run create-admin-user
```

This will create an admin user with:
- **Email**: victor@victor.ro
- **Password**: victor
- **Role**: admin

### Troubleshooting

**Connection refused error:**
- Ensure PostgreSQL is running: `pg_isready`
- Check if port 5432 is correct: `lsof -i :5432`
- Verify DATABASE_URL format

**Authentication failed:**
- Check PostgreSQL username and password
- Verify database exists: `psql -l`

**Table doesn't exist:**
- The script will create the `users` table automatically
- If you need to run migrations manually, see `supabase/migrations/`

