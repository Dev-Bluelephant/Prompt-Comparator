# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Custom nginx config if needed for SPA routing (React Router), 
# but for this simple app default might suffice. 
# However, it's safer to ensure index.html serves for all routes if we add routing later.
# For now, this is a single page app without client-side routing libraries, so default is fine.

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
