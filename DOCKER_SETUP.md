# TodoList Application - Docker Setup Guide

## 📋 Project Overview

This is a **Full-Stack TodoList Application** with Docker containerization, featuring:
- **Frontend**: React + Vite
- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL
- **Orchestration**: Docker Compose with 2 custom networks and persistent volumes

## 🏗️ Architecture

### Services

1. **Frontend Service** (port 5173)
   - React application built with Vite
   - Communicates with backend via API
   - Network: `frontend-network`

2. **Backend Service** (port 3001)
   - Express.js REST API
   - Manages CRUD operations for tasks
   - Network: `frontend-network` + `backend-network`

3. **PostgreSQL Database** (port 5432)
   - Task storage
   - Network: `backend-network` (isolated from frontend)
   - Volume: `postgres_data` for persistence

### Networks

- **frontend-network**: Connects frontend and backend services
- **backend-network**: Connects backend and PostgreSQL (secure isolation)

### Database Schema

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Quick Start

### Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 1.29+)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd list_lenoir
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Build and start containers**
   ```bash
   docker-compose up --build
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - PostgreSQL: localhost:5432

4. **Stop the application**
   ```bash
   docker-compose down
   ```

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Frontend
VITE_API_URL=http://localhost:3001

# Backend
BACKEND_PORT=3001
FRONTEND_URL=http://localhost:5173

# PostgreSQL
DB_USER=todouser
DB_PASSWORD=todopassword123
DB_NAME=todolist_db
DB_HOST=postgres
DB_PORT=5432
```

## 🐳 Docker Configuration

### docker-compose.yml Structure

```yaml
services:
  postgres:
    - Image: postgres:16-alpine
    - Port: 5432
    - Volume: postgres_data (for data persistence)
    - Network: backend-network

  backend:
    - Build: ./backend/Dockerfile
    - Port: 3001
    - Networks: backend-network, frontend-network
    - Depends on: postgres

  frontend:
    - Build: ./list_lenoir/Dockerfile
    - Port: 5173
    - Network: frontend-network
    - Depends on: backend
```

### Volumes

- **postgres_data**: Persists PostgreSQL database files
  - Location: `/var/lib/postgresql/data`
  - Driver: local

## 🔌 API Endpoints

### GET /api/tasks
Retrieve all tasks
```bash
curl http://localhost:3001/api/tasks
```

### GET /api/tasks/:id
Retrieve a specific task
```bash
curl http://localhost:3001/api/tasks/1
```

### POST /api/tasks
Create a new task
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Task name",
    "description": "Task description"
  }'
```

### PUT /api/tasks/:id
Update a task
```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Updated name",
    "description": "Updated description",
    "completed": true
  }'
```

### DELETE /api/tasks/:id
Delete a task
```bash
curl -X DELETE http://localhost:3001/api/tasks/1
```

## 📊 Testing Container Communication

### Test Backend Health
```bash
docker-compose exec backend curl http://localhost:3001/health
```

### Test Database Connection
```bash
docker-compose exec postgres psql -U todouser -d todolist_db -c "SELECT * FROM tasks;"
```

### Test API from Frontend Container
```bash
docker-compose exec frontend curl http://backend:3001/api/tasks
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs postgres
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

## 🗄️ Data Persistence

The PostgreSQL database is configured with a named volume `postgres_data`. Data persists even when containers are stopped:

```bash
# Check volumes
docker volume ls

# Inspect volume
docker volume inspect list_lenoir_postgres_data

# Remove volume (WARNING: deletes all data)
docker volume rm list_lenoir_postgres_data
```

## 🔐 Security Features

1. **Network Isolation**
   - Backend is the only service connecting frontend and database
   - Frontend cannot directly access PostgreSQL

2. **Environment Variables**
   - Sensitive data (passwords) stored in `.env`
   - Never commit `.env` to version control

3. **Row Level Security**
   - Disabled for testing purposes (enable in production)
   - Located in backend/server.js

## 🛠️ Common Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose stop

# Remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build

# Execute command in container
docker-compose exec backend npm install package-name

# View service status
docker-compose ps
```

## 📈 Scaling and Production

For production deployment:

1. **Use environment-specific configs**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
   ```

2. **Add health checks** (already included in docker-compose.yml)

3. **Configure resource limits**
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '0.5'
             memory: 512M
   ```

4. **Use strong passwords**
   - Change `DB_PASSWORD` in production

5. **Enable HTTPS**
   - Configure reverse proxy (nginx)
   - Obtain SSL certificates

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change ports in .env
BACKEND_PORT=3002
DB_PORT=5433
```

### Database Connection Failed
```bash
# Check if postgres is healthy
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Wait for postgres to be ready (usually 5-10 seconds)
```

### Frontend Cannot Connect to Backend
```bash
# Verify VITE_API_URL in .env
# Ensure backend container is running
docker-compose ps backend

# Check network connectivity
docker-compose exec frontend curl http://backend:3001/health
```

### Permission Denied Errors
```bash
# Run with sudo or add user to docker group
sudo docker-compose up
# OR
sudo usermod -aG docker $USER
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 👥 Project Structure

```
list_lenoir/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── server.js
├── list_lenoir/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskList.css
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskItem.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
├── docker-compose.yml
├── .env.example
├── .env.local
├── .gitignore
└── DOCKER_SETUP.md
```

## 📝 Notes

- Row Level Security (RLS) is disabled on PostgreSQL for testing purposes
- Change DB credentials in production
- The application uses CORS allowing all origins (configure in production)
- Images should be pushed to Docker Hub for team sharing

## 🚢 Deploying to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag your images
docker tag list_lenoir_frontend username/todolist-frontend:1.0
docker tag list_lenoir_backend username/todolist-backend:1.0

# Push to Docker Hub
docker push username/todolist-frontend:1.0
docker push username/todolist-backend:1.0

# Pull and run from Docker Hub
docker pull username/todolist-frontend:1.0
docker pull username/todolist-backend:1.0
```

---

**Created**: November 2024
**Version**: 1.0.0
