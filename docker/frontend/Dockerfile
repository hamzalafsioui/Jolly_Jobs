# ─────────────────────────────────────────────
# Stage 1: Development (Vite dev server)
# ─────────────────────────────────────────────
FROM node:20-alpine AS dev

WORKDIR /app

# Install dependencies first (cached layer)
COPY frontend/package*.json ./
RUN npm ci

# Source is volume-mounted at runtime for HMR
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ─────────────────────────────────────────────
# Stage 2: Build production assets
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# ─────────────────────────────────────────────
# Stage 3: Serve with Nginx (production only)
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/frontend/nginx-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
