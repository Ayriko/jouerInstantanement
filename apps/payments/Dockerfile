FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ─── Pruner ───────────────────────────────────────────────────────────────────
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
ARG SERVICE_NAME
# Turbo v2 : argument positionnel (--scope était la syntaxe Turbo v1)
RUN turbo prune ${SERVICE_NAME} --docker

# ─── Installer les dépendances ────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

# ─── Builder ──────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=installer /app .
COPY --from=pruner /app/out/full/ .

ARG SERVICE_NAME
ARG SERVICE_PATH=apps/${SERVICE_NAME}

RUN pnpm turbo run build --filter=${SERVICE_NAME}

# Crée un bundle de prod autonome (résout les symlinks pnpm workspace)
RUN pnpm --filter=${SERVICE_NAME} deploy /deploy
# Copie le dist compilé dans le bundle de déploiement
RUN cp -r /app/${SERVICE_PATH}/dist /deploy/dist

# ─── Runner ───────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /deploy ./

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
