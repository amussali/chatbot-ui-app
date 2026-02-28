FROM node:20-alpine AS base
WORKDIR /app

# Install ALL dependencies first (including devDeps for build)
COPY package*.json ./
RUN npm ci

# Build stage - TypeScript now available
FROM base AS builder
COPY . .
RUN npm run build

# Production runner - ONLY production deps
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy ONLY production node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT=3000 NODE_ENV=production HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
