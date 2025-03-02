# Use official Node.js image as base
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build TypeScript files
RUN npm run build

# Ensure the output directory is correctly referenced
CMD ["node", "build/server.js"]

# Expose the server port
EXPOSE 5000