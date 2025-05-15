######## 1️⃣  Dev + Prod dependencies (needed for compilation) ########
FROM node:23-alpine AS devdeps         
WORKDIR /usr/src/app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci        # ← no --omit=dev

######## 2️⃣  Build (uses devdeps) ########
FROM node:23-alpine AS build
WORKDIR /usr/src/app
COPY --from=devdeps /usr/src/app/node_modules ./node_modules
COPY --from=devdeps /usr/src/app/package*.json ./



COPY tsconfig*.json ./
COPY src ./src
RUN npm run build   # -> dist/

######## 3️⃣  Runtime (prod‑only deps) ########
FROM node:23-alpine AS runtime
WORKDIR /usr/src/app

# Install prod dependencies
COPY --from=devdeps /usr/src/app/node_modules ./node_modules
COPY --from=devdeps /usr/src/app/package*.json ./

# Copy Prisma schema


COPY src/prisma ./src/prisma
RUN npx prisma generate --schema=./src/prisma/schema.prisma

# Copy compiled JS
COPY --from=build /usr/src/app/dist ./dist

# Setup
ENV NODE_ENV=production \
    PORT=3002

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3002
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3002/health || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]


######## 4️⃣  Dev image (hot‑reload) ########
FROM devdeps AS dev
WORKDIR /usr/src/app

# copy source & configs so TS runs directly
COPY tsconfig*.json ./
COPY src ./src
COPY nodemon.json ./nodemon.json
COPY src/prisma ./src/prisma

RUN npx prisma generate --schema=./src/prisma/schema.prisma 

CMD ["npm", "run", "dev"]     # nodemon / ts-node-dev
# no ENTRYPOINT: we want CMD so compose override can still change it


FROM devdeps AS test

COPY tsconfig*.json ./
COPY jest.config.* ./               
COPY src ./src
COPY src/prisma ./src/prisma

RUN npx prisma generate --schema=./src/prisma/schema.prisma


CMD ["npm", "run", "test:run"]

