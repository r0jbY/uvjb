FROM node:23-alpine AS build

# Declare the ARG
ARG VITE_API_URL

# Also set it as an ENV, good practice
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY . .

# ✅ Write the .env file so Vite picks it up
RUN echo "VITE_API_URL=$VITE_API_URL" > .env

# ✅ Now install and build
RUN npm install && npm run build

RUN echo "VITE_API_URL=$VITE_API_URL"

CMD ["npm", "run", "preview", "--", "--port", "5173", "--host"]
