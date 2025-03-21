# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install devDependencies too
ENV NODE_ENV=development
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3001

# Run dev script using nodemon
CMD ["npm", "run", "dev"]
