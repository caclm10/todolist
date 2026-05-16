# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Nonaktifkan telemetri Next.js saat build
ENV NEXT_TELEMETRY_DISABLED 1
# Berikan URL palsu agar build tidak error saat inisialisasi database
ENV DATABASE_URL="file:dummy.db"

RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Tambahkan user non-root untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin aset publik dan hasil build standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Salin file yang diperlukan untuk migrasi database (drizzle push)
COPY --from=builder --chown=nextjs:nodejs /app/db ./db
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Salin entrypoint script
COPY --chown=nextjs:nodejs entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Buat folder data untuk SQLite dan berikan izin akses
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Gunakan entrypoint script untuk menjalankan migrasi sebelum server start
CMD ["./entrypoint.sh"]
