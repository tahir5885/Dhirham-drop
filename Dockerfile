# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 1: Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/normalizer/package.json ./packages/normalizer/
COPY apps/web/package.json ./apps/web/
COPY apps/extension/package.json ./apps/extension/
COPY apps/crawlers/package.json ./apps/crawlers/

RUN npm ci

# Stage 2: Build the source code
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_OUTPUT_STANDALONE=true
ENV NODE_ENV=production

# Build all monorepo packages and apps
RUN npm run build

# Stage 3: Production runner
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets and standalone build output
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Copy database directory for SQLite database persistence
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/prisma ./packages/database/prisma

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
