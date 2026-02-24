FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
ARG SERVICE_NAME=web
RUN turbo prune ${SERVICE_NAME} --docker

FROM base AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

ARG SERVICE_NAME=web
RUN pnpm turbo run build --filter=${SERVICE_NAME}

FROM base AS runner
WORKDIR /app

ARG SERVICE_NAME=web

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/${SERVICE_NAME}/next.config.js ./apps/${SERVICE_NAME}/
COPY --from=builder /app/apps/${SERVICE_NAME}/package.json ./apps/${SERVICE_NAME}/
COPY --from=builder /app/apps/${SERVICE_NAME}/public ./apps/${SERVICE_NAME}/public

COPY --from=builder --chown=nextjs:nodejs /app/apps/${SERVICE_NAME}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${SERVICE_NAME}/.next/static ./apps/${SERVICE_NAME}/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
