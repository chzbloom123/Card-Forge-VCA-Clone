FROM oven/bun:1.1-alpine
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
RUN DATABASE_URL="postgresql://postgres:gPsgijAgguarMmdTyzhwuRrOxadMRUCz@postgres.railway.internal:5432/railway"
EXPOSE 3000
CMD ["sh", "-c", "bunx prisma db push --schema=./prisma/prisma/schema.prisma --accept-data-loss && bun run --smol src/index.ts"]
