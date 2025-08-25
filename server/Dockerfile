FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install only production dependencies (faster)
RUN npm install --omit=dev --frozen-lockfile

# Copy the rest of your code
COPY . .

# Expose your backend port
EXPOSE 4000

# Start your server
CMD ["node", "index.js"]  # change if your entry point is different
