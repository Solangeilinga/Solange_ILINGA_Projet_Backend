# Blog API

API REST complète pour une application de blog, développée avec Node.js, Express et MySQL.

## Stack technique

- **Runtime** : Node.js (ES Modules)
- **Framework** : Express.js
- **Base de données** : MySQL via mysql2 (pool de connexions)
- **Authentification** : JWT + bcryptjs
- **Upload** : Multer
- **Sécurité** : helmet, express-rate-limit, CORS, requêtes paramétrées

## Fonctionnalités

- Authentification JWT (register, login, profil, reset mot de passe)
- Système de rôles : `lecteur`, `auteur`, `admin`
- CRUD complet des articles (avec image de couverture, statut, vues)
- Tags many-to-many sur les articles
- Commentaires imbriqués (réponses)
- Likes et favoris (toggle)
- Catégories
- Articles similaires
- Protection contre le brute-force (rate limiting)

## Installation

### Prérequis

- Node.js v18+
- MySQL

### Étapes

**1. Cloner le projet**

```bash
git clone https://github.com/ton-username/blog-api.git
cd blog-api
```

**2. Installer les dépendances**

```bash
npm install
```

**3. Configurer l'environnement**

```bash
cp .env.example .env
```

Puis éditer `.env` avec tes valeurs :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=blog_api
JWT_SECRET=une_cle_secrete_longue
PORT=5000
CLIENT_URL=http://localhost:3000
```

**4. Créer la base de données**

Importer le fichier SQL dans phpMyAdmin ou via le terminal :

```bash
mysql -u root -p < blog_api_v2.sql
```

**5. Créer le dossier uploads**

```bash
mkdir uploads
```

**6. Lancer le serveur**

```bash
# Développement
npm run dev

# Production
npm start
```

Le serveur démarre sur `http://localhost:5000`

## Structure du projet

```
src/
├── config/
│   └── db.js                  # Connexion MySQL
├── controllers/
│   ├── authController.js
│   ├── articleController.js
│   ├── commentController.js
│   ├── categoryController.js
│   ├── tagController.js
│   ├── likeController.js
│   └── favoriController.js
├── middleware/
│   ├── authMiddleware.js       # JWT + rôles
│   ├── uploadMiddleware.js     # Multer
│   ├── validateId.js           # Validation des IDs
│   └── rateLimitMiddleware.js  # Rate limiting
├── models/
│   ├── userModel.js
│   ├── articleModel.js
│   ├── commentModel.js
│   ├── categoryModel.js
│   ├── tagModel.js
│   ├── likeModel.js
│   └── favoriModel.js
├── routes/
│   ├── authRoutes.js
│   ├── articleRoutes.js
│   ├── commentRoutes.js
│   ├── categoryRoutes.js
│   ├── tagRoutes.js
│   └── favoriRoutes.js
├── uploads/                    # Images uploadées (non versionné)
├── app.js
└── server.js
```

## Endpoints

### Authentification

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| POST | `/auth/register` | Public | Inscription |
| POST | `/auth/login` | Public | Connexion |
| GET | `/auth/profile` | Connecté | Voir son profil |
| PUT | `/auth/profile` | Connecté | Modifier profil + avatar |
| POST | `/auth/forgot-password` | Public | Demander un reset |
| POST | `/auth/reset-password` | Public | Réinitialiser le mot de passe |

### Articles

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | `/articles` | Public | Lister (`?statut=`, `?categorie_id=`, `?search=`) |
| GET | `/articles/:id` | Public | Détail + vues++ |
| GET | `/articles/:id/related` | Public | Articles similaires |
| POST | `/articles` | Auteur/Admin | Créer |
| PUT | `/articles/:id` | Auteur/Admin | Modifier |
| DELETE | `/articles/:id` | Auteur/Admin | Supprimer |
| POST | `/articles/:id/like` | Connecté | Like/Unlike (toggle) |
| POST | `/articles/:id/save` | Connecté | Favoris (toggle) |

### Commentaires

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | `/comments/article/:id` | Public | Commentaires (arborescents) |
| POST | `/comments` | Connecté | Ajouter (+ réponses via `parent_id`) |
| DELETE | `/comments/:id` | Propriétaire/Admin | Supprimer |

### Autres

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| GET | `/categories` | Public | Lister les catégories |
| POST | `/categories` | Admin | Créer une catégorie |
| GET | `/tags` | Public | Lister les tags |
| POST | `/tags` | Admin | Créer un tag |
| GET | `/favoris` | Connecté | Voir ses favoris |

## Rôles

| Rôle | Permissions |
|------|-------------|
| `lecteur` | Lire, commenter, liker, gérer ses favoris |
| `auteur` | + Créer, modifier, supprimer des articles |
| `admin` | + Créer catégories/tags, supprimer tout commentaire |

> Pour créer un admin, modifier directement en base :
> ```sql
> UPDATE users SET role = 'admin' WHERE email = 'ton@email.com';
> ```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `DB_HOST` | Hôte MySQL |
| `DB_USER` | Utilisateur MySQL |
| `DB_PASSWORD` | Mot de passe MySQL |
| `DB_NAME` | Nom de la base |
| `JWT_SECRET` | Clé secrète JWT |
| `PORT` | Port du serveur (défaut : 5000) |
| `CLIENT_URL` | URL du frontend (CORS) |
