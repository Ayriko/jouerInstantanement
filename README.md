# JouerInstantanement

Marketplace de jeux vidéo full-stack permettant d'acheter des jeux instantanément. L'application propose la gestion des utilisateurs, un catalogue de jeux, un panier d'achats, la liste de souhaits, la gestion des clés de jeu et l'intégration de paiement Stripe.

## Stack technique

**Frontend**

- [Next.js](https://nextjs.org/) 15 avec App Router (React 19)
- TypeScript 5
- Tailwind CSS 4
- next-intl (internationalisation)
- React Hook Form + Zod (validation)
- Stripe.js (paiements côté client)

**Backend (microservices)**

- [NestJS](https://nestjs.com/) 11
- [Better Auth](https://www.better-auth.com/) (authentification, OAuth)
- [Prisma ORM](https://www.prisma.io/) + PostgreSQL 17
- Redis 7 (cache, sessions)
- RabbitMQ 3 (communication asynchrone entre services)

**Outillage**

- [Turborepo](https://turborepo.dev/) (orchestration monorepo)
- pnpm workspaces
- Docker Compose (dépendances locales)
- Jest + Playwright (tests)
- ESLint + Prettier + Husky

## Architecture

```
jouerInstantanement/
├── apps/
│   ├── web/             # Frontend Next.js (port 3001)
│   ├── api-gateway/     # API Gateway NestJS (port 3000)
│   ├── auth/            # Service d'authentification (port 3002)
│   ├── games/           # Service catalogue de jeux
│   ├── keys/            # Service gestion des clés de jeu
│   ├── payments/        # Service paiements Stripe
│   ├── users/           # Service utilisateurs
│   └── wishlists/       # Service liste de souhaits
│
└── packages/
    ├── @repo/prisma/          # Schéma Prisma + client partagé
    ├── @repo/shared-types/    # DTOs et interfaces TypeScript partagés
    ├── @repo/rabbitmq-contracts/ # Contrats de messages RabbitMQ
    ├── @repo/ui/              # Bibliothèque de composants React partagés
    ├── @repo/eslint-config/   # Configuration ESLint
    ├── @repo/jest-config/     # Configuration Jest
    └── @repo/typescript-config/ # Configurations tsconfig
```

### Flux de communication

```
Frontend (web)
    ↓ HTTP
API Gateway  ←→  RabbitMQ  ←→  Microservices (auth, games, payments, users, keys, wishlists)
                                      ↓
                               PostgreSQL / Redis
```

L'API Gateway est le point d'entrée unique du frontend. Il route les requêtes vers les microservices via RabbitMQ pour la communication asynchrone.

## Prérequis

- Node.js 20+
- pnpm 8.15+
- Docker et Docker Compose

## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd jouerInstantanement

# Installer les dépendances
pnpm install
```

## Configuration

Copier le fichier d'exemple et renseigner les variables :

```bash
cp .env.example .env
```

Variables requises :

| Variable                                      | Description                                        |
| --------------------------------------------- | -------------------------------------------------- |
| `DATABASE_URL`                                | URL de connexion PostgreSQL                        |
| `REDIS_URL`                                   | URL de connexion Redis                             |
| `RABBITMQ_URL`                                | URL de connexion RabbitMQ                          |
| `BETTER_AUTH_SECRET`                          | Secret d'authentification (min. 32 caractères)     |
| `JWT_SECRET`                                  | Secret JWT                                         |
| `STRIPE_SECRET_KEY`                           | Clé secrète Stripe                                 |
| `STRIPE_WEBHOOK_SECRET`                       | Secret webhook Stripe                              |
| `FRONTEND_URL`                                | URL du frontend (ex: `http://localhost:3001`)      |
| `GATEWAY_URL`                                 | URL de l'API Gateway (ex: `http://localhost:3000`) |
| `AUTH_SERVICE_URL`                            | URL du service auth (ex: `http://localhost:3002`)  |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | OAuth Discord (optionnel)                          |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`   | OAuth Google (optionnel)                           |

## Développement

### Démarrer les dépendances (Docker)

```bash
# Lance PostgreSQL, Redis et RabbitMQ
pnpm run prepare:deps
```

### Initialiser la base de données

```bash
cd packages/prisma
pnpm prisma migrate dev
pnpm prisma db seed   # si un seed est configuré
```

### Lancer tous les services

```bash
pnpm run dev
```

### Lancer des services spécifiques

```bash
# Frontend uniquement
pnpm run dev --filter=web

# Tout sauf le frontend
pnpm run dev:no-web

# Service d'auth uniquement
pnpm run dev:auth
```

Les services sont accessibles sur :

- Frontend : http://localhost:3001
- API Gateway : http://localhost:3000
- Auth Service : http://localhost:3002
- RabbitMQ UI : http://localhost:15672

## Scripts disponibles

```bash
pnpm run build         # Build de tous les packages et apps
pnpm run dev           # Mode développement (tous les services)
pnpm run test          # Tests unitaires
pnpm run test:e2e      # Tests end-to-end (Playwright)
pnpm run lint          # Lint de tout le monorepo
pnpm run check-types   # Vérification TypeScript
pnpm format            # Formatage du code (Prettier)
```

## Schéma de base de données

### Authentification (Better Auth)

- `User` — profil utilisateur (email, nom, image, vérification email)
- `Account` — liens OAuth (Discord, Google, Roblox, Twitch)
- `Session` — sessions actives avec IP et user-agent
- `Verification` — tokens de vérification email

### Commerce

- `Game` — catalogue de jeux (nom, description, prix, plateformes, genres, tags, screenshots, note)
- `Order` — commandes (`PENDING` | `PAID` | `FAILED` | `REFUNDED`)
- `OrderItem` — lignes de commande (avec clé de jeu assignée)
- `Wishlist` — liste de souhaits par utilisateur

### Gestion des clés

- `GameKey` — clés de licence (valeur, gameId, référence vers l'OrderItem d'utilisation)

## Fonctionnalités

- **Catalogue** — navigation, recherche et filtres par plateforme, genre, tags
- **Authentification** — inscription email/mot de passe + OAuth (Discord, Google, Roblox, Twitch)
- **Panier & Paiements** — intégration Stripe complète avec gestion des statuts de commande
- **Clés de jeu** — assignation automatique d'une clé de licence à l'achat
- **Liste de souhaits** — ajout/suppression de jeux
- **Internationalisation** — support multi-langue via next-intl

## Déploiement

Le projet utilise des Dockerfiles multi-stage optimisés avec Turbo pruning.

```bash
# Build de l'image Docker d'un service
docker build -f apps/web/Dockerfile --build-arg APP=web .

# Build de l'API Gateway
docker build -f apps/api-gateway/Dockerfile --build-arg APP=api-gateway .
```

> [!NOTE]
> Le frontend Next.js est configuré en mode `standalone` pour des images Docker légères.

## Packages partagés

### `@repo/prisma`

Client Prisma partagé entre tous les microservices. Importer depuis `@repo/prisma/client`.

### `@repo/shared-types`

DTOs, interfaces et types TypeScript utilisés par le frontend et les microservices.

### `@repo/rabbitmq-contracts`

Définit les patterns et payloads des messages RabbitMQ échangés entre les services.

### `@repo/ui`

Composants React réutilisables partagés entre les applications.

## Structure d'une feature (exemple)

Pour ajouter une feature, elle implique généralement :

1. **`@repo/shared-types`** — Ajouter le DTO/interface
2. **`@repo/rabbitmq-contracts`** — Définir le pattern de message si async
3. **Microservice** — Implémenter la logique métier
4. **`api-gateway`** — Exposer le endpoint HTTP et router vers le microservice
5. **`web`** — Implémenter l'UI

## Liens utiles

- [Documentation Turborepo](https://turborepo.dev/docs)
- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Better Auth](https://www.better-auth.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Stripe](https://stripe.com/docs)
