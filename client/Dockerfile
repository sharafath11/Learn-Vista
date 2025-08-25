# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy project files and build
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files
COPY package*.json ./
RUN npm install --omit=dev --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000

# Start app
CMD ["npx", "next", "start", "-p", "3000"]
