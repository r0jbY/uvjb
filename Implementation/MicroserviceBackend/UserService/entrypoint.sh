#!/bin/sh
set -e                       # stop on first error

echo "▶️  [entrypoint] Applying Prisma migrations…"

# You only need --schema if the file isn't in the default ./prisma path.
npx prisma migrate deploy --schema=./src/prisma/schema.prisma

echo "▶️  [entrypoint] Starting AuthenticationService…"
exec node dist/index.js      # exec → Node becomes PID 1
