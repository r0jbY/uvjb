FROM node:23-alpine AS build

# 👇 Make sure this ARG is declared before it's used
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY . .

# 👇 This is important! Pass the variable to Vite's build step
RUN npm install && VITE_API_URL=$VITE_API_URL npm run build

# 👇 This is okay for preview mode
CMD ["npm", "run", "preview", "--", "--port", "5173", "--host"]
