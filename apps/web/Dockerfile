# apps/web/Dockerfile
FROM node:20-alpine AS base
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
ENV SERVICE_PATH=apps/${SERVICE_NAME}

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/${SERVICE_PATH}/next.config.js ./${SERVICE_PATH}/
COPY --from=builder /app/${SERVICE_PATH}/package.json ./${SERVICE_PATH}/
COPY --from=builder /app/${SERVICE_PATH}/public ./${SERVICE_PATH}/public

COPY --from=builder --chown=nextjs:nodejs /app/${SERVICE_PATH}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/${SERVICE_PATH}/.next/static ./${SERVICE_PATH}/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]