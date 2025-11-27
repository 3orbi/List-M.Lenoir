# 📝 Application TodoList - Full Stack avec Docker

Une application complète full-stack de liste de tâches démontrant la conteneurisation Docker avec React, Express.js et PostgreSQL.

## ✨ Fonctionnalités

- ✅ Créer, lire, mettre à jour et supprimer des tâches
- ✅ Descriptions de tâches et horodatages
- ✅ Visualisation du suivi de progression
- ✅ Stockage de données persistant avec PostgreSQL
- ✅ API RESTful avec Express.js
- ✅ Interface utilisateur React moderne avec Vite
- ✅ Conteneurisation Docker avec réseau sécurisé
- ✅ Persistance des données avec les volumes Docker

## 🛠️ Stack Technique

| Composant | Technologie |
|-----------|-----------|
| Frontend | React 19 + Vite 7 |
| Backend | Express.js 4.18 + Node.js 20 |
| Base de données | PostgreSQL 16 |
| Conteneurisation | Docker + Docker Compose |

## 📋 Liens Rapides

- **[Guide de Configuration Docker](./DOCKER_SETUP.md)** - Instructions détaillées pour la construction et le déploiement
- **[Documentation API](./DOCKER_SETUP.md#-api-endpoints)** - Référence complète des points de terminaison API
- **[Dépannage](./DOCKER_SETUP.md#-troubleshooting)** - Problèmes courants et solutions

## 🚀 Démarrage

### Prérequis

- Docker (20.10+)
- Docker Compose (1.29+)

### Démarrage Rapide

```bash
# 1. Cloner le dépôt
git clone <votre-url-repo>
cd list_lenoir

# 2. Configurer l'environnement
cp .env.example .env

# 3. Démarrer l'application
docker-compose up --build

# 4. Ouvrir le navigateur
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
                      │ (Base de     │
                      │  données)    │
                      └──────────────┘
```

### Configuration Réseau

- **frontend-network** : Communication Frontend ↔ Backend
- **backend-network** : Communication Backend ↔ Base de données
- **Isolation** : Le frontend ne peut pas accéder directement à la base de données

### Gestion des Volumes

- **postgres_data** : Stockage persistant des données PostgreSQL
- Survit aux redémarrages et suppressions de conteneurs

## 📂 Structure du Projet

```
list_lenoir/
├── backend/                           # Serveur API Express
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js                      # Fichier serveur principal
│   └── .dockerignore
│
├── list_lenoir/                       # Frontend Vite + React
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/               # Composants React
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── App.jsx                   # Composant principal
│   │   ├── main.jsx
│   │   └── *.css                     # Styles
│   ├── package.json
│   ├── vite.config.js
│   └── .dockerignore
│
├── docker-compose.yml                 # Configuration d'orchestration
├── .env.example                       # Modèle d'environnement
├── .gitignore
├── DOCKER_SETUP.md                    # Guide Docker détaillé
└── README.md                          # Ce fichier
```

## 📊 Schéma de Base de Données

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 Points de Terminaison API

### Tâches

| Méthode | Point de terminaison | Description |
|---------|---------------------|-------------|
| GET | `/api/tasks` | Obtenir toutes les tâches |
| GET | `/api/tasks/:id` | Obtenir une tâche spécifique |
| POST | `/api/tasks` | Créer une nouvelle tâche |
| PUT | `/api/tasks/:id` | Mettre à jour une tâche |
| DELETE | `/api/tasks/:id` | Supprimer une tâche |
| GET | `/health` | Vérification de santé |

## 💻 Exemples d'Utilisation

### Créer une Tâche
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Acheter des courses",
    "description": "Lait, œufs, pain"
  }'
```

### Mettre à Jour une Tâche
```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Voir Toutes les Tâches
```bash
curl http://localhost:3001/api/tasks
```

## 🐳 Commandes Docker

```bash
# Construire et démarrer
docker-compose up --build

# Démarrer en arrière-plan
docker-compose up -d

# Arrêter les services
docker-compose stop

# Supprimer les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f [service]

# Exécuter une commande
docker-compose exec [service] [commande]
```

## 🔒 Sécurité

- Isolation réseau entre le frontend et la base de données
- RLS désactivé pour le développement (à activer en production)
- Variables d'environnement pour les données sensibles
- CORS configuré pour l'accès API

## 📈 Surveillance

### Vérifier le Statut des Services
```bash
docker-compose ps
```

### Voir les Logs
```bash
docker-compose logs -f
```

### Requête Base de Données
```bash
docker-compose exec postgres psql -U todouser -d todolist_db -c "SELECT * FROM tasks;"
```

## 🌍 Variables d'Environnement

| Variable | Objectif | Valeur par défaut |
|----------|----------|-------------------|
| VITE_API_URL | Point de terminaison API du frontend | http://localhost:3001 |
| BACKEND_PORT | Port du serveur backend | 3001 |
| FRONTEND_URL | Origine CORS du backend | http://localhost:5173 |
| DB_USER | Utilisateur PostgreSQL | todouser |
| DB_PASSWORD | Mot de passe PostgreSQL | todopassword123 |
| DB_NAME | Nom de la base de données | todolist_db |
| DB_HOST | Nom d'hôte de la base de données | postgres |
| DB_PORT | Port de la base de données | 5432 |

## 📝 Flux de Développement

1. **Développement Local** (sans Docker)
   ```bash
   # Backend
   cd backend && npm install && npm start

   # Frontend (dans un autre terminal)
   cd list_lenoir && npm install && npm run dev
   ```

2. **Développement Docker**
   ```bash
   docker-compose up --build
   ```

3. **Tests**
   - Frontend : http://localhost:5173
   - API : http://localhost:3001/api/tasks

## 🚢 Déploiement sur Docker Hub

```bash
# Construire les images
docker-compose build

# Se connecter et taguer
docker login
docker tag list_lenoir_backend username/todolist-backend:1.0
docker tag list_lenoir_frontend username/todolist-frontend:1.0

# Pousser vers le registre
docker push username/todolist-backend:1.0
docker push username/todolist-frontend:1.0
```

## 🐛 Dépannage

**Conflits de ports ?**
```bash
# Changer les ports dans .env
BACKEND_PORT=3002
DB_PORT=5433
```

**La base de données ne se connecte pas ?**
```bash
docker-compose logs postgres
docker-compose exec postgres pg_isready -U todouser
```

**Le frontend ne peut pas atteindre le backend ?**
```bash
docker-compose exec frontend curl http://backend:3001/health
```

Voir [DOCKER_SETUP.md](./DOCKER_SETUP.md#-troubleshooting) pour plus d'aide.

## 📚 Ressources d'Apprentissage

- [Documentation Docker](https://docs.docker.com/)
- [Guide Docker Compose](https://docs.docker.com/compose/)
- [API Express.js](https://expressjs.com/)
- [Documentation React](https://react.dev/)
- [Manuel PostgreSQL](https://www.postgresql.org/docs/)

## 📝 Projet Académique

Ce projet répond aux exigences pour :
- Conteneurisation d'application full-stack
- Orchestration Docker et Docker Compose
- Réseau multi-services et sécurité
- Persistance des données avec volumes
- Documentation complète

## 📄 Licence

Licence MIT - Voir le fichier LICENSE pour plus de détails

## 👨‍💻 Auteur

Créé à des fins éducatives - Projet de conteneurisation Docker

---

**Dernière Mise à Jour** : Novembre 2024
**Version** : 1.0.0
