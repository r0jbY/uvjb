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

# a. copy *all* deps first
COPY --from=devdeps /usr/src/app/node_modules ./node_modules
COPY --from=devdeps /usr/src/app/package*.json ./


# b. then prune away dev deps
RUN npm prune --omit=dev --no-audit --no-fund

# c. copy compiled JS
COPY --from=build /usr/src/app/dist ./dist

ENV NODE_ENV=production \
    PORT=8080

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["npm", "run", "start"]

######## 4️⃣  Dev image (hot‑reload) ########
FROM devdeps AS dev
WORKDIR /usr/src/app

# copy source & configs so TS runs directly
COPY tsconfig*.json ./
COPY src ./src
COPY nodemon.json ./nodemon.json

CMD ["npm", "run", "dev"]     # nodemon / ts-node-dev
# no ENTRYPOINT: we want CMD so compose override can still change it
