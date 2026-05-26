#!/bin/sh
set -e
cd /app
npx prisma migrate deploy
exec node src/backend/server.js
