#!/bin/sh
set -e                       # stop on first error

echo "▶️  [entrypoint] Applying Prisma migrations…"

# You only need --schema if the file isn't in the default ./prisma path.
npx prisma migrate deploy --schema=./src/prisma/schema.prisma

if [ "$RUN_MODE" = "test" ]; then
  echo "🧪 Running integration tests..."
  exec npm run test:integration:run
else
  echo "▶️  Starting AuthenticationService…"
  exec npm start
fi
