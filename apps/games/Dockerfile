FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ─── Pruner ───────────────────────────────────────────────────────────────────
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
# Remplace "service-name" par le nom du package dans ton package.json
ARG SERVICE_NAME
RUN turbo prune --scope=${SERVICE_NAME} --docker

# ─── Installer les dépendances ────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

# Copie uniquement les fichiers nécessaires aux deps (meilleur cache Docker)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# ─── Builder ──────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=installer /app .
COPY --from=pruner /app/out/full/ .

ARG SERVICE_NAME
RUN pnpm turbo run build --filter=${SERVICE_NAME}

# ─── Runner ───────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs

ARG SERVICE_NAME
ARG SERVICE_PATH=apps/${SERVICE_NAME}

# Copie uniquement le build final + node_modules de prod
COPY --from=builder --chown=nestjs:nodejs /app/${SERVICE_PATH}/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/${SERVICE_PATH}/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]