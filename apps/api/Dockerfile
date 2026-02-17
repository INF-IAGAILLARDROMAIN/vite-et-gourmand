FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client
RUN npx prisma generate
# Build NestJS
RUN npm run build

# Production
FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]
