# 1. Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build Next.js app
RUN npm run build

# 2. Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

# Expose Next.js port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "run", "start"]
