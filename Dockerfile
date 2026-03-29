# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Enable pnpm via corepack (matches packageManager field in package.json)
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

WORKDIR /app

# Copy lockfile + manifests first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install all deps (including devDeps needed for the build)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Type-check + build
RUN pnpm build


# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config: support client-side routing (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
