# Use Node.js image for building the frontend
FROM node:22 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend project
COPY . .

# Build the frontend
RUN npm run build

# Use Nginx for serving the static files
FROM nginx:alpine

# Copy the built frontend files to Nginx's default serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
