# Debian slim — @libsql native bindings fail on Alpine (musl: fcntl64)
FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
COPY scripts ./scripts
COPY pricing.json ./
COPY src/backend ./src/backend

RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL="file:./dev.db"

EXPOSE 3001

COPY docker/entrypoint-backend.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
