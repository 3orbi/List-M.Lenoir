# 🎨 Frontend Application (FRONT)

## Overview

This directory contains the React + Vite frontend application for the TodoList project.

## 📁 Structure

```
FRONT/
├── src/
│   ├── components/          # React components
│   │   ├── TaskForm.jsx     # Task creation form
│   │   ├── TaskForm.css
│   │   ├── TaskList.jsx     # Task list container
│   │   ├── TaskList.css
│   │   ├── TaskItem.jsx     # Individual task item
│   │   └── TaskItem.css
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── Dockerfile               # Docker image configuration
├── vite.config.js           # Vite build configuration
├── package.json             # Dependencies
├── index.html               # HTML entry point
└── public/                  # Static assets
```

## 🚀 Features

✅ Create new tasks
✅ View all tasks in a list
✅ Edit existing tasks
✅ Mark tasks as complete/incomplete
✅ Delete tasks
✅ Progress tracking with statistics
✅ Task timestamps
✅ Responsive UI design
✅ Error handling
✅ Loading states

## 🔧 Technology Stack

- **React** 19.2.0 - UI library
- **Vite** 7.2.2 - Build tool
- **CSS3** - Styling with gradients and animations

## 🏗️ Building

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 🐳 Docker

```bash
docker build -t todolist-frontend:1.0 .
docker run -p 5173:5173 todolist-frontend:1.0
```

## 🌐 API Integration

Backend API URL configured in `.env`:
```env
VITE_API_URL=http://localhost:3001
```

## 📚 Components

- **App.jsx** - Main application component
- **TaskForm.jsx** - Task creation form
- **TaskList.jsx** - Task list container
- **TaskItem.jsx** - Individual task component

## 📚 Related Documentation

- See **README.md** in root for project overview
- See **DOCKER_SETUP.md** for Docker configuration
- See **GETTING_STARTED.md** for quick start

---

**Technology**: React 19 + Vite 7
**Last Updated**: November 2024
