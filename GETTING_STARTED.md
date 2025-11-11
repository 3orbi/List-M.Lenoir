# 🚀 Getting Started - TodoList Docker Project

Welcome to the TodoList Full-Stack Application! This guide will help you get up and running quickly.

---

## ⚡ 30-Second Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start the application
docker-compose up --build

# 3. Open browser
# Frontend: http://localhost:5173
# API: http://localhost:3001
```

That's it! Your application is running.

---

## 📋 What This Project Includes

This is a **production-ready full-stack application** with:
- **Frontend**: React + Vite (modern, fast)
- **Backend**: Express.js API (secure, scalable)
- **Database**: PostgreSQL (reliable, persistent)
- **Docker**: Fully containerized (portable, deployable)

---

## 🖥️ System Requirements

Before you start, make sure you have:

- **Docker** (version 20.10+)
  - Download: https://www.docker.com/products/docker-desktop
  - Verify: `docker --version`

- **Docker Compose** (version 1.29+)
  - Usually comes with Docker Desktop
  - Verify: `docker-compose --version`

- **Git** (optional, for cloning)
  - Verify: `git --version`

---

## 📁 Project Structure

```
list_lenoir/
├── README.md               ← Project overview
├── DOCKER_SETUP.md         ← Detailed Docker guide
├── DOCKER_HUB.md          ← How to push to Docker Hub
├── docker-compose.yml      ← Container orchestration
├── .env.example           ← Configuration template
│
├── backend/               ← Express.js API
│   └── Dockerfile
│   └── server.js
│
└── list_lenoir/           ← React Frontend
    └── Dockerfile
    └── src/
        └── components/
```

---

## 🔧 Initial Setup

### Step 1: Clone or Navigate to Project

If you haven't already, clone the repository:

```bash
git clone <repository-url>
cd list_lenoir
```

### Step 2: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

This creates a `.env` file with default development values. You can edit this file if needed.

**⚠️ Important**: Never commit the `.env` file to Git. It's already in `.gitignore`.

### Step 3: Verify Docker Installation

```bash
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Test Docker (should show hello-world message)
docker run hello-world
```

---

## 🚀 Starting the Application

### Option 1: Automated Startup (Recommended)

```bash
bash start.sh
```

This script will:
1. Create `.env` if missing
2. Build all Docker images
3. Start all services
4. Display status and URLs

### Option 2: Manual Startup

```bash
# Build images
docker-compose build

# Start services in foreground (see logs)
docker-compose up

# OR start in background
docker-compose up -d
```

---

## ✅ Verify Everything is Running

### Check Services

```bash
docker-compose ps
```

You should see 3 services running:
- `todolist_frontend` on port 5173
- `todolist_backend` on port 3001
- `todolist_postgres` on port 5432

### Test the API

```bash
curl http://localhost:3001/health
```

Should return: `{"status":"Backend is running"}`

### Open the Application

1. **Frontend**: http://localhost:5173
2. **API docs**: http://localhost:3001/api/tasks

---

## 🧪 Using the Application

### Create a Task

1. Go to http://localhost:5173
2. Enter task name (e.g., "Learn Docker")
3. Optionally add description
4. Click "+ Add Task"

### Manage Tasks

- ✅ **Check** the checkbox to mark complete
- ✏️ **Edit** by clicking the edit button
- 🗑️ **Delete** by clicking the trash button
- 📊 **Progress** bar shows completion percentage

---

## 📝 API Testing

### Using curl

```bash
# Get all tasks
curl http://localhost:3001/api/tasks

# Create a task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"nom":"My Task","description":"Task description"}'

# Update a task
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a task
curl -X DELETE http://localhost:3001/api/tasks/1
```

### Using Automated Test Script

```bash
bash test-api.sh
```

This runs through all 6 API endpoints with example data.

---

## 🛑 Stopping the Application

### Stop Services (Keep Volumes)

```bash
docker-compose stop
```

Data persists. You can restart with `docker-compose start`.

### Stop and Remove Containers

```bash
docker-compose down
```

Containers are removed, but data volume persists.

### Full Cleanup (Removes Everything)

```bash
docker-compose down -v
```

⚠️ **Warning**: This removes the database volume. You'll lose all data!

---

## 🔍 Troubleshooting

### Port Already in Use

**Error**: `Address already in use`

**Solution**: Change ports in `.env`:
```env
BACKEND_PORT=3002
DB_PORT=5433
```

### Database Connection Failed

**Error**: `connection refused`

**Solution**:
```bash
# Check PostgreSQL health
docker-compose exec postgres pg_isready -U todouser

# View logs
docker-compose logs postgres
```

### Frontend Can't Connect to Backend

**Error**: `Failed to fetch tasks`

**Solution**:
```bash
# Verify backend is running
docker-compose ps backend

# Check VITE_API_URL
cat .env | grep VITE_API_URL

# Test from frontend container
docker-compose exec frontend curl http://backend:3001/health
```

### Docker Command Not Found

**Solution**:
- Restart your terminal
- Or: Use full path `/usr/local/bin/docker-compose`

---

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs postgres
docker-compose logs frontend

# Follow in real-time
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100
```

### Check Service Health

```bash
# PostgreSQL
docker-compose exec postgres pg_isready -U todouser

# Backend
docker-compose exec backend curl http://localhost:3001/health

# Frontend (check files)
docker-compose exec frontend ls -la dist/
```

---

## 📈 Next Steps

### 1. Explore the Code
- Read through `/src/components/` for React code
- Check `backend/server.js` for API code
- Review `docker-compose.yml` for container setup

### 2. Learn More
- **DOCKER_SETUP.md** - Comprehensive Docker guide
- **PROJECT_SUMMARY.md** - Architecture overview
- **README.md** - Features and capabilities

### 3. Make Changes

Edit any file and rebuild:

```bash
# Edit source code
vim list_lenoir/src/App.jsx

# Rebuild and restart
docker-compose up --build
```

### 4. Deploy to Docker Hub

When ready to share:

```bash
# Build images
docker-compose build

# Tag for Docker Hub
docker tag list_lenoir_backend username/todolist-backend:1.0
docker tag list_lenoir_frontend username/todolist-frontend:1.0

# Push to registry
docker push username/todolist-backend:1.0
docker push username/todolist-frontend:1.0
```

See **DOCKER_HUB.md** for detailed instructions.

---

## 📚 Useful Documentation

| File | Purpose |
|------|---------|
| README.md | Project overview and features |
| DOCKER_SETUP.md | Complete Docker guide and troubleshooting |
| DOCKER_HUB.md | How to push to Docker Hub |
| PROJECT_SUMMARY.md | Architecture and file structure |
| FILES_CREATED.md | Explanation of each file |
| SUBMISSION_CHECKLIST.md | Pre-submission verification |

---

## 💡 Pro Tips

1. **Use `docker-compose logs -f`** to watch what's happening
2. **Keep .env in .gitignore** to protect secrets
3. **Test locally first** before pushing to Docker Hub
4. **Save your work regularly** with git commits
5. **Read error messages** - they usually tell you what's wrong

---

## 🎓 Learning Resources

- **Docker Official Docs**: https://docs.docker.com/
- **Express.js Guide**: https://expressjs.com/
- **React Documentation**: https://react.dev/
- **PostgreSQL Manual**: https://www.postgresql.org/docs/
- **Docker Hub**: https://hub.docker.com/

---

## 🆘 Getting Help

### Quick Checks

1. **All services running?**
   ```bash
   docker-compose ps
   ```

2. **Any errors in logs?**
   ```bash
   docker-compose logs | grep -i error
   ```

3. **API responding?**
   ```bash
   curl http://localhost:3001/health
   ```

### Common Issues

See **DOCKER_SETUP.md** section "🐛 Troubleshooting" for:
- Port conflicts
- Database connection issues
- Frontend/backend communication
- Permission errors

---

## ✨ You're All Set!

You now have a fully functional full-stack application running in Docker.

**Next**: Visit http://localhost:5173 and create your first task! 📝

---

## 📝 Quick Reference

```bash
# Start
docker-compose up --build

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Rebuild
docker-compose up --build

# Remove everything
docker-compose down -v

# Test API
bash test-api.sh

# Cleanup
docker system prune -a
```

---

**Questions?** Check DOCKER_SETUP.md or the relevant documentation file.

**Ready to submit?** See SUBMISSION_CHECKLIST.md

**Happy coding!** 🚀

