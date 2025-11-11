# 🐳 Deploying to Docker Hub

This guide explains how to push your TodoList application images to Docker Hub.

## 📋 Prerequisites

1. **Docker Hub Account**
   - Create a free account at [hub.docker.com](https://hub.docker.com)
   - Remember your username

2. **Docker Installed**
   - Version 20.10+

## 🚀 Deployment Steps

### Step 1: Build Images Locally

```bash
# Navigate to project root
cd list_lenoir

# Build all images
docker-compose build
```

### Step 2: Login to Docker Hub

```bash
docker login
```

When prompted:
- Username: Your Docker Hub username
- Password: Your Docker Hub password
- Email: Your email address

### Step 3: Tag Your Images

Replace `YOUR_USERNAME` with your actual Docker Hub username:

```bash
# Tag backend image
docker tag list_lenoir_backend YOUR_USERNAME/todolist-backend:1.0
docker tag list_lenoir_backend YOUR_USERNAME/todolist-backend:latest

# Tag frontend image
docker tag list_lenoir_frontend YOUR_USERNAME/todolist-frontend:1.0
docker tag list_lenoir_frontend YOUR_USERNAME/todolist-frontend:latest
```

### Step 4: Push to Docker Hub

```bash
# Push backend
docker push YOUR_USERNAME/todolist-backend:1.0
docker push YOUR_USERNAME/todolist-backend:latest

# Push frontend
docker push YOUR_USERNAME/todolist-frontend:1.0
docker push YOUR_USERNAME/todolist-frontend:latest
```

### Step 5: Verify on Docker Hub

1. Go to [hub.docker.com](https://hub.docker.com)
2. Login to your account
3. Check your repositories
4. You should see:
   - `todolist-backend`
   - `todolist-frontend`

## 🔄 Using Docker Hub Images

### Pull from Docker Hub

```bash
docker pull YOUR_USERNAME/todolist-backend:1.0
docker pull YOUR_USERNAME/todolist-frontend:1.0
```

### Update docker-compose.yml

Modify `docker-compose.yml` to use images from Docker Hub instead of building locally:

```yaml
services:
  backend:
    image: YOUR_USERNAME/todolist-backend:1.0
    # Remove the 'build' section

  frontend:
    image: YOUR_USERNAME/todolist-frontend:1.0
    # Remove the 'build' section
```

### Run from Docker Hub

```bash
# With local docker-compose.yml updated
docker-compose up

# Or pull and run directly
docker run -d -p 3001:3001 YOUR_USERNAME/todolist-backend:1.0
docker run -d -p 5173:5173 YOUR_USERNAME/todolist-frontend:1.0
```

## 📊 Docker Hub Repository Management

### Make Repository Public

1. Go to Docker Hub
2. Select your repository
3. Go to Settings
4. Under "Repository visibility", select "Public"

### Add Repository Description

1. Go to Docker Hub
2. Select your repository
3. Edit the description field
4. Example:
   ```
   TodoList application with React frontend, Express backend, and PostgreSQL database.
   Fully containerized with Docker Compose.

   - Frontend: React + Vite
   - Backend: Express.js
   - Database: PostgreSQL

   Quick start: docker pull [username]/todolist-frontend:1.0
   ```

### Add README

1. Create a `README_DOCKER_HUB.md` file in your repository root
2. Docker Hub automatically displays the README from your GitHub repo

## 🏷️ Tagging Conventions

Use semantic versioning:

```bash
# Development
docker tag list_lenoir_backend YOUR_USERNAME/todolist-backend:dev
docker push YOUR_USERNAME/todolist-backend:dev

# Release versions
docker tag list_lenoir_backend YOUR_USERNAME/todolist-backend:1.0.0
docker push YOUR_USERNAME/todolist-backend:1.0.0

# Latest stable
docker tag list_lenoir_backend YOUR_USERNAME/todolist-backend:latest
docker push YOUR_USERNAME/todolist-backend:latest
```

## 🔐 Security Considerations

### Never Push Sensitive Data

❌ **DON'T** include in images:
- `.env` files
- API keys
- Database credentials
- Private keys

✅ **DO** use:
- Environment variables at runtime
- Docker secrets (for production)
- `.dockerignore` file

### Scan for Vulnerabilities

```bash
# Docker Scout (built-in)
docker scout cves YOUR_USERNAME/todolist-backend:1.0

# Or use online scanners
# - Trivy: https://github.com/aquasecurity/trivy
# - Snyk: https://snyk.io/
```

## 📈 Automating Image Builds

### GitHub Actions (Recommended)

Create `.github/workflows/docker-publish.yml`:

```yaml
name: Docker Publish

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/todolist-backend:latest
            ${{ secrets.DOCKER_USERNAME }}/todolist-backend:${{ github.sha }}

      - name: Build and push Frontend
        uses: docker/build-push-action@v4
        with:
          context: ./list_lenoir
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/todolist-frontend:latest
            ${{ secrets.DOCKER_USERNAME }}/todolist-frontend:${{ github.sha }}
```

### Set GitHub Secrets

1. Go to GitHub repo > Settings > Secrets and variables > Actions
2. Add:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

## 📝 Example: Full Deployment Workflow

```bash
#!/bin/bash

USERNAME="your-docker-username"
VERSION="1.0.0"

echo "Building images..."
docker-compose build

echo "Tagging backend..."
docker tag list_lenoir_backend $USERNAME/todolist-backend:$VERSION
docker tag list_lenoir_backend $USERNAME/todolist-backend:latest

echo "Tagging frontend..."
docker tag list_lenoir_frontend $USERNAME/todolist-frontend:$VERSION
docker tag list_lenoir_frontend $USERNAME/todolist-frontend:latest

echo "Logging in to Docker Hub..."
docker login

echo "Pushing backend..."
docker push $USERNAME/todolist-backend:$VERSION
docker push $USERNAME/todolist-backend:latest

echo "Pushing frontend..."
docker push $USERNAME/todolist-frontend:$VERSION
docker push $USERNAME/todolist-frontend:latest

echo "✅ Deployment complete!"
echo "Backend: docker pull $USERNAME/todolist-backend:$VERSION"
echo "Frontend: docker pull $USERNAME/todolist-frontend:$VERSION"
```

Save as `deploy.sh` and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🆘 Troubleshooting

### Login Failed

```bash
# Use access token instead of password
docker login -u YOUR_USERNAME
# Paste your access token as password
```

### Image Push Failed

```bash
# Check disk space
docker system df

# Clean up unused images
docker system prune

# Retry push
docker push YOUR_USERNAME/todolist-backend:1.0
```

### Image Not Found After Push

```bash
# Verify image exists locally
docker images | grep todolist

# Verify push was successful
docker push YOUR_USERNAME/todolist-backend:1.0 --verbose
```

## 📚 Related Resources

- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Docker Hub Best Practices](https://docs.docker.com/docker-hub/repos/)
- [Docker Security Documentation](https://docs.docker.com/engine/security/)
- [GitHub Actions with Docker](https://docs.docker.com/ci-cd/github-actions/)

## ✅ Checklist for Submission

- [ ] Created Docker Hub account
- [ ] Built all Docker images
- [ ] Logged into Docker Hub
- [ ] Tagged images correctly
- [ ] Pushed backend image to Docker Hub
- [ ] Pushed frontend image to Docker Hub
- [ ] Verified images on Docker Hub
- [ ] Tested pulling images from Docker Hub
- [ ] Updated docker-compose.yml for production
- [ ] Documented image URLs in submission

---

**Tips:**
- Use the same image names as your project name for consistency
- Keep images small by using Alpine Linux base images
- Update images when dependencies are patched
- Use version tags for production releases

