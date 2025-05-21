FROM mcr.microsoft.com/playwright:v1.52.0-jammy

# Set working directory
WORKDIR /e2e

# Copy package files first for caching
COPY package.json package-lock.json* tsconfig.json ./

# Install dependencies
RUN npm install

# Copy test files and config
COPY . .

# Default command: run Playwright tests (auto-handles TypeScript)
CMD ["npx", "playwright", "test"]
