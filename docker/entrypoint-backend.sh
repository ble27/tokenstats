#!/bin/sh
set -e
cd /app

if [ -n "$TURSO_DATABASE_URL" ]; then
  node scripts/migrate-turso.mjs
else
  npx prisma migrate deploy
fi
exec node src/backend/server.js
