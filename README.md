# 📝 TodoList Application - Full Stack with Docker

A complete full-stack todo list application demonstrating Docker containerization with React, Express.js, and PostgreSQL.

## ✨ Features

- ✅ Create, read, update, and delete tasks
- ✅ Task descriptions and timestamps
- ✅ Progress tracking visualization
- ✅ Persistent data storage with PostgreSQL
- ✅ RESTful API with Express.js
- ✅ Modern React UI with Vite
- ✅ Docker containerization with secure networking
- ✅ Data persistence with Docker volumes

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 19 + Vite 7 |
| Backend | Express.js 4.18 + Node.js 20 |
| Database | PostgreSQL 16 |
| Containerization | Docker + Docker Compose |

## 📋 Quick Links

- **[Docker Setup Guide](./DOCKER_SETUP.md)** - Detailed instructions for building and deploying
- **[API Documentation](./DOCKER_SETUP.md#-api-endpoints)** - Complete API endpoint reference
- **[Troubleshooting](./DOCKER_SETUP.md#-troubleshooting)** - Common issues and solutions

## 🚀 Getting Started

### Prerequisites

- Docker (20.10+)
- Docker Compose (1.29+)

### Quick Start

```bash
# 1. Clone repository
git clone <your-repo-url>
cd list_lenoir

# 2. Setup environment
cp .env.example .env

# 3. Start application
docker-compose up --build

# 4. Open browser
# Frontend: http://localhost:5173
# API: http://localhost:3001
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend Network                 │
│  ┌──────────────┐          ┌──────────────┐        │
│  │   Frontend   │◄────────►│   Backend    │        │
│  │   (React)    │ HTTP/API │ (Express)    │        │
│  └──────────────┘          └──────────────┘        │
└─────────────────────────────────────────────────────┘
                              │
                     Backend Network
                              │
                      ┌──────────────┐
                      │  PostgreSQL  │
                      │  (Database)  │
                      └──────────────┘
```

### Network Configuration

- **frontend-network**: Frontend ↔ Backend communication
- **backend-network**: Backend ↔ Database communication
- **Isolation**: Frontend cannot directly access database

### Volume Management

- **postgres_data**: Persistent PostgreSQL data storage
- Survives container restarts and removals

## 📂 Project Structure

```
list_lenoir/
├── backend/                           # Express API server
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js                      # Main server file
│   └── .dockerignore
│
├── list_lenoir/                       # Vite + React frontend
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx
│   │   └── *.css                     # Styles
│   ├── package.json
│   ├── vite.config.js
│   └── .dockerignore
│
├── docker-compose.yml                 # Orchestration config
├── .env.example                       # Environment template
├── .gitignore
├── DOCKER_SETUP.md                    # Detailed Docker guide
└── README.md                          # This file
```

## 📊 Database Schema

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/health` | Health check |

## 💻 Usage Examples

### Create a Task
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'
```

### Update a Task
```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### View All Tasks
```bash
curl http://localhost:3001/api/tasks
```

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up --build

# Start in background
docker-compose up -d

# Stop services
docker-compose stop

# Remove containers
docker-compose down

# View logs
docker-compose logs -f [service]

# Execute command
docker-compose exec [service] [command]
```

## 🔒 Security

- Network isolation between frontend and database
- Disabled RLS for development (enable in production)
- Environment variables for sensitive data
- CORS configured for API access

## 📈 Monitoring

### Check Service Status
```bash
docker-compose ps
```

### View Logs
```bash
docker-compose logs -f
```

### Database Query
```bash
docker-compose exec postgres psql -U todouser -d todolist_db -c "SELECT * FROM tasks;"
```

## 🌍 Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| VITE_API_URL | Frontend API endpoint | http://localhost:3001 |
| BACKEND_PORT | Backend server port | 3001 |
| FRONTEND_URL | Backend CORS origin | http://localhost:5173 |
| DB_USER | PostgreSQL user | todouser |
| DB_PASSWORD | PostgreSQL password | todopassword123 |
| DB_NAME | Database name | todolist_db |
| DB_HOST | Database hostname | postgres |
| DB_PORT | Database port | 5432 |

## 📝 Development Workflow

1. **Local Development** (without Docker)
   ```bash
   # Backend
   cd backend && npm install && npm start

   # Frontend (in another terminal)
   cd list_lenoir && npm install && npm run dev
   ```

2. **Docker Development**
   ```bash
   docker-compose up --build
   ```

3. **Testing**
   - Frontend: http://localhost:5173
   - API: http://localhost:3001/api/tasks

## 🚢 Deployment to Docker Hub

```bash
# Build images
docker-compose build

# Login and tag
docker login
docker tag list_lenoir_backend username/todolist-backend:1.0
docker tag list_lenoir_frontend username/todolist-frontend:1.0

# Push to registry
docker push username/todolist-backend:1.0
docker push username/todolist-frontend:1.0
```

## 🐛 Troubleshooting

**Port conflicts?**
```bash
# Change ports in .env
BACKEND_PORT=3002
DB_PORT=5433
```

**Database not connecting?**
```bash
docker-compose logs postgres
docker-compose exec postgres pg_isready -U todouser
```

**Frontend can't reach backend?**
```bash
docker-compose exec frontend curl http://backend:3001/health
```

See [DOCKER_SETUP.md](./DOCKER_SETUP.md#-troubleshooting) for more help.

## 📚 Learning Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [Express.js API](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)

## 📝 Project Assignment

This project fulfills requirements for:
- Full-stack application containerization
- Docker and Docker Compose orchestration
- Multi-service networking and security
- Data persistence with volumes
- Complete documentation

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Created for educational purposes - Docker containerization project

---

**Last Updated**: November 2024
**Version**: 1.0.0
