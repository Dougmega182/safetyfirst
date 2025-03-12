# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./standalone/
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./standalone/.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl --fail http://localhost:3000/ || exit 1
CMD ["node", "standalone/server.js"]
