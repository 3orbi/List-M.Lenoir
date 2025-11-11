# 📁 Project Structure - TodoList Docker Application

## Overview

The project is organized into 3 main directories: FRONT (Frontend), BACK (Backend), and BDD (Database).

---

## 📂 Complete Directory Tree

```
list_lenoir/                          # Root project directory
│
├── 📂 FRONT/                         # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx          # Task creation component
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskList.jsx          # Task list container
│   │   │   ├── TaskList.css
│   │   │   ├── TaskItem.jsx          # Individual task item
│   │   │   └── TaskItem.css
│   │   ├── App.jsx                   # Main React component
│   │   ├── App.css                   # App styles
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── public/                       # Static assets
│   ├── Dockerfile                    # Frontend Docker image
│   ├── .dockerignore                 # Docker build excludes
│   ├── package.json                  # Dependencies (React, Vite)
│   ├── package-lock.json             # Dependency lock file
│   ├── vite.config.js                # Vite configuration
│   ├── index.html                    # HTML entry point
│   ├── eslint.config.js              # ESLint configuration
│   └── README.md                     # Frontend documentation
│
├── 📂 BACK/                          # Backend Application (Express.js)
│   ├── server.js                     # Express server (230+ lines)
│   │                                 # - API endpoints
│   │                                 # - Database connection
│   │                                 # - CRUD operations
│   ├── Dockerfile                    # Backend Docker image
│   ├── .dockerignore                 # Docker build excludes
│   ├── package.json                  # Dependencies (Express, pg)
│   ├── init-db.sql                   # Database schema
│   └── README.md                     # Backend documentation
│
├── 📂 BDD/                           # Database Configuration
│   ├── init-db.sql                   # PostgreSQL initialization script
│   │                                 # - Create tasks table
│   │                                 # - Create indexes
│   │                                 # - Set permissions
│   └── README.md                     # Database documentation
│
├── 📄 docker-compose.yml             # Multi-container orchestration
│                                     # - 3 services: frontend, backend, postgres
│                                     # - 2 networks: frontend-network, backend-network
│                                     # - 1 volume: postgres_data
│
├── 📄 .env.example                   # Environment variables template
├── 📄 .env.local                     # Local development environment
├── 📄 .gitignore                     # Git ignore rules
│
├── 📚 README.md                      # Main project documentation
├── 📚 GETTING_STARTED.md             # Quick start guide
├── 📚 DOCKER_SETUP.md                # Comprehensive Docker guide
├── 📚 DOCKER_HUB.md                  # Docker Hub deployment guide
├── 📚 PROJECT_SUMMARY.md             # Architecture overview
├── 📚 SUBMISSION_CHECKLIST.md        # Pre-submission checklist
├── 📚 FILES_CREATED.md               # File descriptions
│
├── 🚀 start.sh                       # Automated startup script
├── 🧪 test-api.sh                    # API testing script
└── 📄 package.json                   # Root package.json (Docker scripts)

```

---

## 🗂️ Directory Purposes

### FRONT/ - Frontend Application

**Purpose**: React + Vite user interface

**Key Files**:
- `src/` - React source code
- `Dockerfile` - Frontend image configuration
- `vite.config.js` - Build tool configuration
- `package.json` - Dependencies (React, Vite)

**What it does**:
- Creates task interface
- Manages task state
- Communicates with backend API
- Displays results to users

---

### BACK/ - Backend API

**Purpose**: Express.js RESTful API server

**Key Files**:
- `server.js` - Main application (230+ lines)
- `Dockerfile` - Backend image configuration
- `package.json` - Dependencies (Express, PostgreSQL)
- `init-db.sql` - Database schema

**What it does**:
- Handles HTTP requests
- Manages task data
- Validates inputs
- Communicates with database

---

### BDD/ - Database Configuration

**Purpose**: PostgreSQL database setup

**Key Files**:
- `init-db.sql` - Database initialization script

**What it does**:
- Creates tasks table
- Creates performance indexes
- Sets permissions
- Initializes on container startup

---

## 🔄 File Relationships

```
docker-compose.yml
├── context: ./FRONT → Builds from FRONT/Dockerfile
├── context: ./BACK → Builds from BACK/Dockerfile
└── postgres service → Uses BDD/init-db.sql

FRONT/
├── Communicates with BACK via API
└── Uses VITE_API_URL env var

BACK/
├── Receives requests from FRONT
├── Connects to BDD (PostgreSQL)
└── Uses DB_* env vars

BDD/
└── Stores data for BACK to use
```

---

## 📊 File Organization by Purpose

### Configuration Files
```
.env.example          → Environment variables template
.env.local            → Local development values
.gitignore            → Git ignore rules
docker-compose.yml    → Container orchestration
```

### Frontend Files (FRONT/)
```
src/                  → React components and styles
Dockerfile            → Frontend image
vite.config.js        → Build configuration
package.json          → Dependencies
```

### Backend Files (BACK/)
```
server.js             → Express API
Dockerfile            → Backend image
package.json          → Dependencies
```

### Database Files (BDD/)
```
init-db.sql           → Schema and initialization
```

### Documentation
```
README.md             → Main overview
GETTING_STARTED.md    → Quick start
DOCKER_SETUP.md       → Docker guide
DOCKER_HUB.md         → Hub deployment
PROJECT_SUMMARY.md    → Architecture
SUBMISSION_CHECKLIST  → Pre-submission
FILES_CREATED.md      → File descriptions
```

### Scripts
```
start.sh              → Automated startup
test-api.sh           → API testing
```

---

## 🔐 What Goes Where

### ✅ In FRONT/
- React components
- Frontend styles (CSS)
- Vite configuration
- Frontend dependencies
- HTML entry point

### ✅ In BACK/
- Express server code
- API endpoints
- Database queries
- Backend dependencies
- Validation logic

### ✅ In BDD/
- SQL schema definition
- Database initialization
- Indexes
- Permissions

### ✅ In Root (list_lenoir/)
- docker-compose.yml (orchestrates all 3)
- Environment files (.env)
- Documentation
- Scripts (start.sh, test-api.sh)
- .gitignore

---

## 🚀 Build & Deployment

### Building

```bash
# From root directory
docker-compose build
```

This automatically:
1. Builds FRONT/ Docker image
2. Builds BACK/ Docker image
3. Pulls postgres:16-alpine image

### Running

```bash
docker-compose up
```

This:
1. Starts postgres container with BDD/init-db.sql
2. Starts backend container with BACK/server.js
3. Starts frontend container with FRONT/

### Services Communication

```
FRONT (port 5173)
    ↓ HTTP requests
BACK (port 3001)
    ↓ SQL queries
BDD (port 5432 - PostgreSQL)
```

---

## 📁 File Counts

| Directory | Files | Purpose |
|-----------|-------|---------|
| FRONT/ | 12+ | React application |
| BACK/ | 5+ | Express API |
| BDD/ | 2 | Database |
| Root | 15+ | Config & Docs |
| **Total** | **35+** | **Complete application** |

---

## 🔄 Dependency Flow

```
docker-compose.yml (orchestrator)
├── FRONT/ Dockerfile
│   ├── src/ (React code)
│   ├── package.json (dependencies)
│   └── vite.config.js (build)
│
├── BACK/ Dockerfile
│   ├── server.js (API code)
│   ├── package.json (dependencies)
│   └── init-db.sql (runs during startup)
│
└── postgres:16-alpine
    └── BDD/init-db.sql (initialization)
```

---

## 📈 Scaling Structure

The 3-folder structure is:
- **Scalable**: Each service can be developed independently
- **Maintainable**: Clear separation of concerns
- **Deployable**: Each folder has its own Dockerfile
- **Testable**: Each component can be tested separately

---

## 🎯 Working with This Structure

### Adding a New Frontend Feature
1. Create component in `FRONT/src/components/`
2. Import in `FRONT/src/App.jsx`
3. Style in separate `.css` file

### Adding a New API Endpoint
1. Add route in `BACK/server.js`
2. Add database query if needed
3. Update frontend to call new endpoint

### Modifying Database Schema
1. Edit `BDD/init-db.sql`
2. Rebuild: `docker-compose down -v && docker-compose up --build`
3. Data will be reinitialized

---

## 📚 Documentation in Each Folder

- **FRONT/README.md** - Frontend specifics
- **BACK/README.md** - Backend specifics  
- **BDD/README.md** - Database specifics
- **Root/README.md** - Project overview
- **Root/DOCKER_SETUP.md** - Docker guide

---

## ✨ Key Benefits of This Structure

1. **Clear Organization** - Each service in its own folder
2. **Easy Maintenance** - Find what you need quickly
3. **Independent Deployment** - Services can be deployed separately
4. **Scalability** - Easy to add more services
5. **Team Collaboration** - Teams can work on different folders
6. **Version Control** - Clean git history per service

---

**Structure Type**: Monorepo with Docker Compose
**Best For**: Full-stack applications
**Created**: November 2024

