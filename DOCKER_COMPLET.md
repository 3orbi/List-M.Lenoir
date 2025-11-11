# 🐳 DOCKER COMPLET - Guide Complet pour la Soutenance

## Table des Matières
1. [C'est quoi Docker ?](#cest-quoi-docker)
2. [Architecture du Projet](#architecture-du-projet)
3. [Les 2 Dockerfiles](#les-2-dockerfiles)
4. [docker-compose.yml](#docker-composeyml)
5. [Variables d'Environnement (.env)](#variables-denvironnement-env)
6. [Workflow entre Frontend et Backend](#workflow-entre-frontend-et-backend)
7. [Réseaux et Sécurité](#réseaux-et-sécurité)
8. [Volume et Persistance](#volume-et-persistance)
9. [Commandes Docker](#commandes-docker)
10. [Résumé pour la Soutenance](#résumé-pour-la-soutenance)

---

## C'est quoi Docker?

Docker est un **conteneur** qui isole une application avec toutes ses dépendances. C'est comme une boîte scellée qui contient tout ce dont l'app a besoin pour fonctionner.

### Sans Docker
```
Ma machine
├─ Node.js version 18
├─ PostgreSQL version 14
├─ npm packages v1.0
└─ Mon code
   (Ça marche chez moi mais pas chez toi)
```

### Avec Docker
```
Conteneur #1 (Frontend)
├─ Node.js 20
├─ React
└─ Vite

Conteneur #2 (Backend)
├─ Node.js 20
├─ Express
└─ Mon code

Conteneur #3 (DB)
├─ PostgreSQL 16
└─ Données

(Ça marche identiquement partout)
```

**Avantages :**
- ✅ Reproductible (marche sur toutes les machines)
- ✅ Isolé (pas de conflits de versions)
- ✅ Facile à déployer
- ✅ Facile à arrêter/démarrer

---

## Architecture du Projet

### Vue d'ensemble

```
                     TON APPLICATION TODOLIST
                     ========================

    Frontend                Backend                 Database
    (React/Vite)            (Express)              (PostgreSQL)

    Port 5173               Port 3001               Port 5432
    Conteneur #1            Conteneur #2           Conteneur #3

    ┌──────────────┐        ┌──────────────┐       ┌──────────────┐
    │ todolist_    │        │ todolist_    │       │ todolist_    │
    │ frontend     │        │ backend      │       │ postgres     │
    └──────────────┘        └──────────────┘       └──────────────┘
           ↓                       ↓                      ↓
    list_lenoir-          list_lenoir-            postgres:16-
    frontend:latest       backend:latest          alpine
    252 MB                453 MB                   81 MB
    (créée par toi)       (créée par toi)        (officielle)
```

### 3 Services = 3 Conteneurs = 3 Rôles

| Service | Rôle | Port | Conteneur | Image |
|---------|------|------|-----------|-------|
| **Frontend** | Affiche l'interface React | 5173 | todolist_frontend | list_lenoir-frontend |
| **Backend** | API REST (Express) | 3001 | todolist_backend | list_lenoir-backend |
| **Database** | Stocke les tâches | 5432 | todolist_postgres | postgres:16-alpine |

---

## Les 2 Dockerfiles

### 1️⃣ BACK/Dockerfile (Backend - Simple)

**Chemin:** `list_lenoir/BACK/Dockerfile`

```dockerfile
# Commence avec l'image Node.js de base
FROM node:20-alpine

# Crée le dossier /app dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances npm
RUN npm install

# Copie tout le code du projet
COPY . .

# Expose le port 3001 (documentation)
EXPOSE 3001

# Commande à exécuter au démarrage
CMD ["npm", "start"]
```

#### Explication ligne par ligne

| Ligne | Explication |
|-------|-------------|
| `FROM node:20-alpine` | Utilise l'image Node.js v20 (alpine = ultra-légère) |
| `WORKDIR /app` | Crée et entre dans le dossier `/app` du conteneur |
| `COPY package*.json ./` | Copie package.json et package-lock.json |
| `RUN npm install` | Installe express, cors, pg, dotenv, etc. |
| `COPY . .` | Copie tout le code (server.js, etc.) |
| `EXPOSE 3001` | Indique que le conteneur écoute sur le port 3001 |
| `CMD ["npm", "start"]` | Lance `npm start` qui exécute `node server.js` |

#### Résultat
- **Image créée:** `list_lenoir-backend:latest`
- **Taille:** ~453 MB
- **Contient:** Node.js + Express + ton code Backend
- **Au démarrage:** Lance le serveur Express sur le port 3001

---

### 2️⃣ FRONT/Dockerfile (Frontend - Avancé avec Multi-Stage Build)

**Chemin:** `list_lenoir/FRONT/Dockerfile`

```dockerfile
# ========== STAGE 1 : BUILD (grosse image pour compiler) ==========
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Compile le code React avec Vite
RUN npm run build
# Cette commande crée le dossier /dist avec le code optimisé


# ========== STAGE 2 : PRODUCTION (image légère finale) ==========
FROM node:20-alpine

WORKDIR /app

# Installe "serve" : serveur HTTP ultra-léger
RUN npm install -g serve

# Copie SEULEMENT le dossier /dist de l'autre image
# (pas les sources, pas node_modules, pas Vite)
COPY --from=build /app/dist ./dist

EXPOSE 5173

# Lance le serveur sur le dossier compilé
CMD ["serve", "-s", "dist", "-l", "5173"]
```

#### Explication du Multi-Stage Build

**STAGE 1 (BUILD) - Grosse image**
```
FROM node:20-alpine AS build
   ↓
Installe npm, React, Vite, webpack, etc.
   ↓
RUN npm run build
   ↓
Crée le dossier /dist avec le code compilé
   ↓
Taille : ~900 MB (très lourd)
   ↓
MAIS : Cette image n'est utilisée que pour compiler !
```

**STAGE 2 (PRODUCTION) - Image légère**
```
FROM node:20-alpine (NOUVELLE image vierge)
   ↓
Installe seulement "serve" (serveur ultra-léger)
   ↓
COPY --from=build /app/dist ./dist
   ↓
Copie seulement le code compilé
   ↓
Taille : ~252 MB (3x plus léger !)
   ↓
C'est cette image que Docker utilise en production
```

#### Pourquoi Multi-Stage Build ?

Sans multi-stage, l'image finale ferait 900 MB et contiendrait :
- Node.js
- npm
- Vite (compilateur)
- React (sources)
- Tous les outils inutiles en production

Avec multi-stage, l'image finale fait 252 MB et ne contient que :
- Node.js (léger)
- serve (serveur ultra-léger)
- /dist (code compilé seulement)

**Résultat:** Image 3.5x plus petite et plus rapide à télécharger !

#### Résultat
- **Image créée:** `list_lenoir-frontend:latest`
- **Taille:** ~252 MB (grâce au multi-stage)
- **Contient:** Seulement le code compilé optimisé
- **Au démarrage:** Lance `serve` pour servir les fichiers HTML/CSS/JS

---

### 3️⃣ PostgreSQL (Image Officielle)

**Pas de Dockerfile !**

Pourquoi ? PostgreSQL a une image officielle sur Docker Hub : `postgres:16-alpine`

Au lieu de créer notre propre Dockerfile, on la réutilise directement dans docker-compose.yml :

```yaml
postgres:
    image: postgres:16-alpine  # ← Image officielle téléchargée
```

- **Image:** `postgres:16-alpine`
- **Taille:** ~81 MB
- **Téléchargée de:** Docker Hub (pas créée par nous)
- **Contient:** PostgreSQL version 16

---

## docker-compose.yml

**Chemin:** `list_lenoir/docker-compose.yml`

C'est le fichier **principal** qui orchestrate tout !

```yaml
version: '3.8'

services:
  # Service 1 : Base de données
  postgres:
    image: postgres:16-alpine                    # Image officielle
    container_name: todolist_postgres            # Nom du conteneur
    environment:
      POSTGRES_USER: ${DB_USER}                  # ← Lit du .env
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${DB_PORT}:5432"                        # Port local : Port conteneur
    volumes:
      - postgres_data:/var/lib/postgresql/data   # Données persistantes
    networks:
      - backend-network                          # Réseau interne
    healthcheck:                                 # Vérifie que c'est prêt
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Service 2 : Backend API
  backend:
    build:
      context: ./BACK                            # Dossier du Dockerfile
      dockerfile: Dockerfile
    container_name: todolist_backend
    environment:
      DB_HOST: postgres                          # Nom du conteneur PostgreSQL
      DB_USER: ${DB_USER}                        # Lecture depuis .env
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      DB_PORT: ${DB_PORT}
      BACKEND_PORT: ${BACKEND_PORT}
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "${BACKEND_PORT}:3001"                   # Port local 3001 → conteneur
    depends_on:
      postgres:
        condition: service_healthy               # Attend que PostgreSQL soit prêt
    networks:
      - backend-network                          # Peut parler à PostgreSQL
      - frontend-network                         # Peut parler au Frontend
    restart: unless-stopped                      # Redémarre si crash

  # Service 3 : Frontend
  frontend:
    build:
      context: ./FRONT                           # Dossier du Dockerfile
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${VITE_API_URL}           # Variable Vite
    container_name: todolist_frontend
    environment:
      VITE_API_URL: ${VITE_API_URL}
    ports:
      - "5173:5173"                              # Port local 5173 → conteneur
    depends_on:
      - backend                                  # Attend que Backend soit prêt
    networks:
      - frontend-network                         # Peut parler au Backend
    restart: unless-stopped

# Volumes nommés (persistance)
volumes:
  postgres_data:                                 # Sauvegarde les données PostgreSQL
    driver: local

# Réseaux personnalisés
networks:
  frontend-network:                              # Frontend ↔ Backend
    driver: bridge

  backend-network:                               # Backend ↔ PostgreSQL
    driver: bridge
```

### Explication des clés importantes

| Clé | Rôle |
|-----|------|
| `services` | Définit les 3 services (postgres, backend, frontend) |
| `build.context` | Dossier qui contient le Dockerfile |
| `environment` | Variables d'environnement du conteneur |
| `ports` | Mappe un port local sur un port du conteneur |
| `depends_on` | Déclare les dépendances entre services |
| `networks` | Connecte les conteneurs à des réseaux spécifiques |
| `volumes` | Sauvegarde les données de manière persistante |
| `healthcheck` | Vérifie que le service est prêt |

---

## Variables d'Environnement (.env)

**Chemin:** `list_lenoir/.env`

Ce fichier contient toutes les **configurations centralisées**. Docker les remplace automatiquement dans docker-compose.yml.

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

### Comment ça marche ?

Quand tu vois dans docker-compose.yml :
```yaml
POSTGRES_USER: ${DB_USER}
```

Docker remplace `${DB_USER}` par `todouser` (valeur du .env)

**Avantage:** Tu peux changer les identifiants sans toucher au code !

---

## Workflow entre Frontend et Backend

### 🔄 Flux complet d'une requête

#### Étape 1️⃣ : L'utilisateur ouvre l'app

```
User ouvre http://localhost:5173
         ↓
         Browser charge App.jsx
         ↓
         React lance useEffect()
         ↓
         Appelle : fetch(`${VITE_API_URL}/api/tasks`)
         ↓
         VITE_API_URL = "http://localhost:3001" (du .env)
         ↓
         Requête HTTP envoyée à http://localhost:3001/api/tasks
```

#### Étape 2️⃣ : Le Backend reçoit la requête

```
Backend (Express) écoute sur port 3001
         ↓
         Reçoit GET /api/tasks
         ↓
         Exécute le handler :

         app.get('/api/tasks', async (req, res) => {
           const result = await pool.query('SELECT * FROM tasks...')
           res.json(result.rows)
         })
```

#### Étape 3️⃣ : Le Backend parle à la DB

```
Backend utilise pg (PostgreSQL driver)
         ↓
         Connexion définie par :
         - DB_HOST: "postgres"      (nom du conteneur PostgreSQL)
         - DB_USER: "todouser"      (du .env)
         - DB_PASSWORD: "..."       (du .env)
         - DB_NAME: "todolist_db"   (du .env)
         - DB_PORT: 5432            (port PostgreSQL)
         ↓
         Query: SELECT * FROM tasks
         ↓
         PostgreSQL retourne les données
```

#### Étape 4️⃣ : Le Backend envoie la réponse

```
Backend récupère les tâches de la DB
         ↓
         Formatte en JSON
         ↓
         Envoie au Frontend :

         res.json([
           { id: 1, nom: "Tâche 1", ... },
           { id: 2, nom: "Tâche 2", ... }
         ])
```

#### Étape 5️⃣ : Le Frontend affiche les données

```
Frontend reçoit la réponse JSON
         ↓
         setTasks(data)
         ↓
         React re-render les composants
         ↓
         L'utilisateur voit les tâches à l'écran
```

### Diagramme complet

```
┌─────────────────────────────────────────────────────────────────┐
│                        WORKFLOW COMPLET                          │
└─────────────────────────────────────────────────────────────────┘

[Frontend - React/Vite - Port 5173]
         ↓
    Browser
         ↓
    fetch('http://localhost:3001/api/tasks')
         ↓
    [frontend-network]  ← Réseau de communication
         ↓
[Backend - Express - Port 3001]
    ├─ Reçoit la requête GET /api/tasks
    ├─ Exécute le handler
    └─ Query : SELECT * FROM tasks
         ↓
    [backend-network]   ← Réseau de communication
         ↓
[Database - PostgreSQL - Port 5432]
    ├─ Connexion établie via :
    │  ├─ Host: "postgres" (nom du conteneur)
    │  ├─ User: "todouser" (du .env)
    │  └─ Password: "..." (du .env)
    └─ Retourne les données
         ↓
[Backend - Express]
    ├─ Formatte JSON
    └─ Retourne au Frontend
         ↓
[Frontend - React]
    ├─ Reçoit JSON
    ├─ setTasks(data)
    └─ Re-render
         ↓
[User sees tasks] ✅
```

### Exemples de requêtes

#### GET toutes les tâches
```javascript
// Frontend (App.jsx)
fetch('http://localhost:3001/api/tasks')
  .then(res => res.json())
  .then(tasks => setTasks(tasks))
```

#### POST nouvelle tâche
```javascript
// Frontend
fetch('http://localhost:3001/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nom: "Ma tâche", description: "..." })
})
  .then(res => res.json())
  .then(newTask => setTasks([newTask, ...tasks]))
```

#### Backend reçoit et traite
```javascript
// Backend (server.js)
app.post('/api/tasks', async (req, res) => {
  const { nom, description } = req.body
  const result = await pool.query(
    'INSERT INTO tasks (nom, description) VALUES ($1, $2) RETURNING *',
    [nom, description]
  )
  res.status(201).json(result.rows[0])
})
```

---

## Réseaux et Sécurité

### 2 Réseaux séparés

```
┌──────────────────────────────────────────────────────────────┐
│                     frontend-network                          │
│  (Frontend et Backend communiquent ici)                      │
│                                                              │
│  ┌──────────────┐  →  ↔  ←  ┌──────────────┐               │
│  │   Frontend   │            │   Backend    │               │
│  │   (5173)     │            │   (3001)     │               │
│  └──────────────┘            └──────────────┘               │
│                                      ↑                       │
└──────────────────────────────────────┼─────────────────────┘
                                       │
                    ┌──────────────────┴─────────────┐
                    │    backend-network             │
                    │  (Backend et DB communiquent)  │
                    │                                │
                    │  ┌──────────────┐             │
                    │  │   Backend    │             │
                    │  │   (3001)     │             │
                    │  └──────────────┘             │
                    │         ↕                     │
                    │  ┌──────────────┐             │
                    │  │  PostgreSQL  │             │
                    │  │  (5432)      │             │
                    │  └──────────────┘             │
                    │                                │
                    └────────────────────────────────┘
```

### Sécurité

**❌ Frontend CANNOT parler directement à PostgreSQL**

```
Frontend → PostgreSQL
❌ BLOQUÉ (pas sur le même réseau)
```

**✅ Frontend PEUT parler au Backend, Backend parle à PostgreSQL**

```
Frontend → [frontend-network] → Backend → [backend-network] → PostgreSQL
✅ AUTORISÉ
```

### Avantages
- **Sécurité :** La DB n'est pas exposée au Frontend
- **Scalabilité :** Peut avoir plusieurs instances du Backend
- **Isolation :** Chaque service est indépendant

---

## Volume et Persistance

### Le Volume `postgres_data`

```yaml
volumes:
  postgres_data:
    driver: local
```

### Sans Volume

```
Conteneur PostgreSQL
    ↓
Données en RAM/tmp
    ↓
Conteneur arrêté
    ↓
DONNÉES PERDUES ❌
```

### Avec Volume

```
Conteneur PostgreSQL
    ↓
Données sauvegardées sur le disque
   (/var/lib/postgresql/data)
    ↓
Volume postgres_data
    ↓
Conteneur arrêté
    ↓
Données restent sur le disque ✅
    ↓
Conteneur redémarré
    ↓
Données restaurées ✅
```

### Configuration

```yaml
postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data
        ↑ Volume nom    ↑ Chemin dans conteneur
```

- **postgres_data** : Volume nommé créé par Docker
- **/var/lib/postgresql/data** : Dossier dans le conteneur où PostgreSQL stocke les données

---

## Commandes Docker

### Démarrer tout

```bash
docker-compose up --build

# Étapes :
# 1. Lit docker-compose.yml
# 2. Construit l'image du Backend (BACK/Dockerfile)
# 3. Construit l'image du Frontend (FRONT/Dockerfile)
# 4. Télécharge l'image PostgreSQL
# 5. Lance les 3 conteneurs
# 6. Les connecte via les réseaux
```

### Arrêter tout

```bash
docker-compose down

# Arrête les conteneurs
# Les images restent (tu les vois dans Docker Desktop)
# Les données du volume restent (persistance)
```

### Voir les conteneurs qui tournent

```bash
docker-compose ps

# Montre :
# - Nom du conteneur
# - État (Running, Exited, etc.)
# - Ports mappés
```

### Voir les logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# -f : suit les logs en temps réel
```

### Accéder à un conteneur

```bash
docker-compose exec backend sh

# sh : shell du conteneur
# Utile pour debugger
```

### Voir les images

```bash
docker images

# Montre :
# - list_lenoir-backend:latest (453 MB)
# - list_lenoir-frontend:latest (252 MB)
# - postgres:16-alpine (81 MB)
```

### Supprimer une image

```bash
docker rmi list_lenoir-backend

# Attention : supprime l'image (mais pas les conteneurs si running)
```

### Nettoyer

```bash
docker system prune -a

# Supprime :
# - Conteneurs arrêtés
# - Images inutilisées
# - Réseaux non utilisés
# ⚠️ Attention : irréversible !
```

---

## Résumé pour la Soutenance

### 🎯 Points clés à connaître

#### 1. Les 2 Images Docker

**list_lenoir-backend:latest** (453 MB)
- Créée à partir de : `BACK/Dockerfile`
- Contient : Node.js + Express + code Backend
- Port : 3001
- Au démarrage : `npm start`

**list_lenoir-frontend:latest** (252 MB)
- Créée à partir de : `FRONT/Dockerfile`
- Technique : Multi-stage build (2 phases)
  - Phase 1 : Compile React avec Vite
  - Phase 2 : Utilise seulement le résultat compilé
- Résultat : 3x plus léger
- Port : 5173
- Au démarrage : `serve -s dist`

**postgres:16-alpine** (81 MB)
- Image officielle (pas créée par nous)
- Téléchargée de Docker Hub
- Port : 5432

#### 2. docker-compose.yml

C'est le fichier principal qui :
- Dit à Docker comment construire les images
- Lance les 3 conteneurs
- Les connecte via des réseaux
- Ajoute le volume pour la persistance
- Lit les variables du .env

#### 3. Workflow Frontend ↔ Backend

```
User → Frontend (React)
            ↓ HTTP request
     Backend (Express)
            ↓ Query
     Database (PostgreSQL)
            ↓ Data
     Backend
            ↓ JSON response
     Frontend
            ↓
User sees data ✅
```

#### 4. Réseaux séparés

- **frontend-network** : Frontend ↔ Backend
- **backend-network** : Backend ↔ PostgreSQL
- Sécurité : Frontend ne peut pas parler directement à la DB

#### 5. Multi-stage Build (Frontend)

- **Stage 1** : Grosse image pour compiler
- **Stage 2** : Image légère pour production
- Résultat : Optimisé et rapide

#### 6. Variables d'environnement (.env)

Centralisent la configuration :
- Identifiants PostgreSQL
- Ports des services
- URLs des APIs

#### 7. Volume pour la DB

Sauvegarde les données sur le disque pour la persistance.

### ✅ Résumé en 30 secondes (pour la présentation)

"J'utilise Docker Compose pour orchestrer 3 services : Frontend (React), Backend (Express), et Database (PostgreSQL).

J'ai créé 2 Dockerfiles :
- Backend : simple, contient Express + code
- Frontend : avancé avec multi-stage build pour optimiser la taille

PostgreSQL utilise une image officielle.

Mon docker-compose.yml crée les 2 images, lance 3 conteneurs, les connecte via des réseaux séparés (sécurité), et ajoute un volume pour persister les données.

Quand je tape `docker-compose up --build`, tout démarre automatiquement. Le Frontend parle au Backend via HTTP, le Backend parle à PostgreSQL via le driver pg. Les données sont sauvegardées même si je redémarre Docker."

### Questions probables

**Q: Pourquoi 2 Dockerfiles ?**
R: Backend et Frontend ont besoin de choses différentes. Frontend doit compiler React, donc on utilise multi-stage pour optimiser la taille.

**Q: Pourquoi pas de Dockerfile pour PostgreSQL ?**
R: PostgreSQL a une image officielle. On la réutilise directement, c'est plus rapide.

**Q: Qu'est-ce que multi-stage build ?**
R: 2 images : Phase 1 compile le code, Phase 2 utilise seulement le résultat. Plus léger et plus rapide.

**Q: Comment le Frontend parle au Backend ?**
R: Via HTTP. Le Frontend appelle `http://localhost:3001/api/tasks` avec fetch(). C'est une requête HTTP classique.

**Q: Pourquoi 2 réseaux séparés ?**
R: Sécurité. Frontend ne peut pas parler directement à la DB. Tout passe par le Backend.

**Q: Qu'est-ce qui arrive aux données si j'arrête Docker ?**
R: Elles sont sauvegardées dans le volume postgres_data. Au redémarrage, elles seront restaurées.

---

**Voilà ! Tu as TOUT ce qu'il faut pour la soutenance. 🚀**
