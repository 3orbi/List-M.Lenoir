# 🚀 Backend API (BACK)

## Overview

This directory contains the Express.js backend API for the TodoList project.

## 📁 Structure

```
BACK/
├── server.js                # Main Express server
├── Dockerfile               # Docker image configuration
├── .dockerignore            # Files to exclude from Docker
├── package.json             # Node.js dependencies
└── init-db.sql              # Database initialization
```

## 🎯 Features

✅ RESTful API with 6 endpoints
✅ CRUD operations (Create, Read, Update, Delete)
✅ CORS configuration
✅ Input validation
✅ Error handling
✅ Database connection pooling
✅ Health check endpoint

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/health` | Health check |

## 🔧 Technology Stack

- **Express.js** 4.18.2 - Web framework
- **Node.js** 20 - Runtime
- **pg** 8.11.3 - PostgreSQL driver
- **CORS** 2.8.5 - Cross-origin resource sharing
- **dotenv** 16.3.1 - Environment variables

## 📦 Dependencies

Install dependencies:

```bash
cd BACK
npm install
```

## 🏗️ Running the Server

### Development Mode

```bash
npm start
```

Starts server on port 3001 (configurable via `BACKEND_PORT` env var)

## 🐳 Docker

### Build Image

```bash
docker build -t todolist-backend:1.0 .
```

### Run Container

```bash
docker run -p 3001:3001 \
  -e DB_USER=todouser \
  -e DB_PASSWORD=todopassword123 \
  -e DB_NAME=todolist_db \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  todolist-backend:1.0
```

## 🔗 API Examples

### Get All Tasks

```bash
curl http://localhost:3001/api/tasks
```

Response:
```json
[
  {
    "id": 1,
    "nom": "Learn Docker",
    "description": "Master containerization",
    "completed": false,
    "timestamp": "2024-11-11T10:00:00Z"
  }
]
```

### Create Task

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "My Task",
    "description": "Task description"
  }'
```

### Update Task

```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete Task

```bash
curl -X DELETE http://localhost:3001/api/tasks/1
```

## 📊 Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| BACKEND_PORT | 3001 | Server port |
| DB_USER | todouser | Database user |
| DB_PASSWORD | todopassword123 | Database password |
| DB_NAME | todolist_db | Database name |
| DB_HOST | postgres | Database hostname |
| DB_PORT | 5432 | Database port |
| FRONTEND_URL | http://localhost:5173 | CORS origin |

## 🔐 Security

- Input validation on all endpoints
- CORS protection
- Parameterized SQL queries (prevents injection)
- Error messages don't expose sensitive info
- Environment variables for configuration

## 📈 Performance

- Connection pooling (pg.Pool)
- Indexed database queries
- JSON response compression
- Error handling prevents crashes

## 🧪 Testing

Test the API:

```bash
# Health check
curl http://localhost:3001/health

# Get all tasks
curl http://localhost:3001/api/tasks

# Run automated tests
bash test-api.sh (from root directory)
```

## 📚 Related Files

- **BACK/Dockerfile** - Docker image configuration
- **BACK/server.js** - Main server code
- **BACK/package.json** - Dependencies list
- **BDD/init-db.sql** - Database schema

## 🔗 Database Connection

The server connects to PostgreSQL using:

```javascript
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
```

## 📞 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
BACKEND_PORT=3002
```

### Database Connection Failed
```bash
# Check database is running
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

### CORS Issues
```bash
# Verify FRONTEND_URL in .env
FRONTEND_URL=http://localhost:5173
```

## 📚 Related Documentation

- See **README.md** in root for project overview
- See **DOCKER_SETUP.md** for Docker configuration
- See **GETTING_STARTED.md** for quick start

---

**Technology**: Express.js 4 + Node 20
**Last Updated**: November 2024
