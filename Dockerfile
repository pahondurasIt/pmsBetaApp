# Step 1: Use Node.js for building the React app
FROM node:20.11.1-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code and build it
COPY . ./
RUN npm run build

# Step 2: Use Nginx to serve the React app
FROM nginx:stable-alpine AS prod

# Copy the React build to Nginx's default html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 9002

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]