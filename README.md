# Movie Finder (React + Express + MongoDB + Redis)

Application full-stack permettant :
- de chercher des films via l’API OMDb (guest)
- de consulter les détails d’un film (guest)
- de créer un compte / se connecter (JWT + refresh cookie)
- de mettre des films en favoris (utilisateur connecté uniquement)
- de créer des Top 3 de films (utilisateur connecté uniquement)
- de consulter la liste publique des utilisateurs + leur profil public (avec leurs top 3 publics)
- l' utilisateur connecté peut créer/consulter/supprimer tout ses top 3 publics et privés dans Mes Top3
- l' utilisateur connecté peut ajouter 3 films a son top 3 depuis la page search

## Stack

### Back
- Node.js + Express
- MongoDB + Mongoose
- Redis (cache OMDb)
- JWT access token + refresh token via cookies

### Front
- React + Vite (TypeScript)
- React Router
---

## Installation

### 1 Cloner le projet

git clone https://github.com/AntoineLAFITTE/Movie-Finder-Interaction-React-Node.git

cd Movie-Finder-Interaction-React-Node

## 2 IMPORTANT ! / Configuration du (.env)

Le fichier .env n’est pas versionné (il est dans le .gitignore).
Après clonage, il faut créer un fichier :

back/.env

PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/moviefinder
JWT_ACCESS_SECRET=change_me_access
JWT_REFRESH_SECRET=change_me_refresh
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
REDIS_URL=redis://127.0.0.1:6379
CLIENT_ORIGIN=http://localhost:3000
OMDB_API_KEY=thewdb


Si OMDb est lent(ça m'est arrivé pas mal de fois) ou renvoie “service unavailable”,
c’est un problème côté API le back gère le fallback et renvoie une erreur propre.

## 3 Installations et lancement dans back et front

### Back
cd back
npm install
npm run dev

### Front
cd front
npm install
npm run dev

## Accès :

Front : http://localhost:3000

Back : http://localhost:4000


### Routes API principales (Back)
Auth

POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/refresh

OMDb (proxy + cache Redis)

GET /omdb/search?q=batman&page=1

GET /omdb/:imdbID

Favorites (auth)

GET /me/favorites

POST /favorites/:movieId

DELETE /favorites/:movieId

Top 3

GET /top3

GET /top3/:id

GET /top3/search?q=action

POST /top3 (auth)

GET /me/top3 (auth)

DELETE /top3/:id (auth)

Users (public)

GET /users (liste users)

GET /users/:username (profil public + top3 publics)

 ### Structure du projet :

Movie-Finder-Interaction-React-Node/
  back/
      package-lock.json
      package.json
    src/
      config/
      controllers/
      middlewares/
      models/
      routes/
      utils/
      validators/
      app.js
      server.js
  front/
    package.json
    package-lock.json
    index.html
    vite.config.ts
    src/
      assets/
      components/
      context/
      hooks/
      pages/
      services/
      App.tsx
      main.tsx
      index.css




Authors : Antoine LAFITTE
