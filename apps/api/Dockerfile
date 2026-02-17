FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy Prisma schema and generate client
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY generated ./generated

# Copy built application
COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
