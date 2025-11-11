# 🗄️ Database Configuration (BDD)

## Overview

This directory contains all database-related files and configurations for the TodoList application.

## 📁 Contents

- **init-db.sql** - Database initialization script
- **docker-entrypoint.sql** - (Optional) Additional initialization scripts

## 🔧 Database Setup

The database is configured with:
- **Type**: PostgreSQL 16
- **Port**: 5432
- **Name**: todolist_db (configurable)

### Schema

The database includes a single `tasks` table:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Features

✅ **Indexes**: Created for `completed` and `timestamp` fields for performance
✅ **Security**: Row Level Security disabled (enable in production)
✅ **Permissions**: All privileges granted to PUBLIC

## 📊 Environment Variables

Database configuration is managed via environment variables:

```env
DB_USER=todouser
DB_PASSWORD=todopassword123
DB_NAME=todolist_db
DB_HOST=postgres
DB_PORT=5432
```

See `.env.example` in the root directory.

## 🚀 Database Initialization

The database is automatically initialized when the PostgreSQL container starts:

1. Container launches
2. `init-db.sql` is executed
3. Tables are created
4. Indexes are built
5. Ready for use

## 🔄 Database Persistence

The database data is persisted using a Docker named volume:

```yaml
volumes:
  postgres_data:
    driver: local
```

Data survives:
- Container restarts
- Container removal

Data is lost only when the volume is explicitly removed:

```bash
docker volume rm list_lenoir_postgres_data
```

## 📝 Useful Commands

### Connect to Database

```bash
docker-compose exec postgres psql -U todouser -d todolist_db
```

### View Tasks

```bash
docker-compose exec postgres psql -U todouser -d todolist_db -c "SELECT * FROM tasks;"
```

### Check Database Health

```bash
docker-compose exec postgres pg_isready -U todouser
```

### Backup Database

```bash
docker-compose exec postgres pg_dump -U todouser todolist_db > backup.sql
```

### Restore Database

```bash
docker-compose exec postgres psql -U todouser todolist_db < backup.sql
```

## 🔐 Security Notes

- **Row Level Security**: Currently disabled for testing. Enable in production:
  ```sql
  ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
  ```

- **Passwords**: Change the default `DB_PASSWORD` in `.env`

- **Backups**: Regular backups recommended for production

## 📚 Related Documentation

- See **DOCKER_SETUP.md** for complete Docker configuration
- See **README.md** for project overview
- See **BACKEND_README.md** for API database queries

---

**Database Version**: PostgreSQL 16
**Created**: November 2024
