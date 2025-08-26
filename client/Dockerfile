# Stage 1: The Build Stage
# Use a Node.js image with an alias 'builder'
FROM node:20 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all other application files
COPY . .

# Pass NEXT_PUBLIC_BASEURL as a build argument
ARG NEXT_PUBLIC_BASEURL

# Set the environment variable for the build process
ENV NEXT_PUBLIC_BASEURL=${NEXT_PUBLIC_BASEURL}

# Build the Next.js application for production
RUN npm run build

# Stage 2: The Final (Lean) Stage
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
# .next folder contains the compiled application
COPY --from=builder /app/.next ./.next

# Copy public assets
COPY --from=builder /app/public ./public

# Copy package.json to install only production dependencies
COPY package.json ./

# Install only production dependencies for the final image
RUN npm install --omit=dev

# Expose the port Next.js runs on
EXPOSE 3000

# Set the same build-time variable for the final image
# This is crucial for runtime access (e.g., for APIs)
ARG NEXT_PUBLIC_BASEURL
ENV NEXT_PUBLIC_BASEURL=${NEXT_PUBLIC_BASEURL}

# Start the Next.js server
CMD ["npm", "start"]