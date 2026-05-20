# --- Build Stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy codebase
COPY . .

# Build the React + Vite production assets
RUN npm run build

# --- Production Stage ---
FROM nginx:stable-alpine

# Copy built static assets from the build stage to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration if needed (handling client-side SPA routing)
# Since Tritium OS is a single page application, we route all requests to index.html
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
