FROM oven/bun:1.1-alpine
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" bunx prisma generate --schema=./prisma/prisma/schema.prisma
EXPOSE 3000
CMD ["sh", "-c", "bunx prisma db push --schema=./prisma/prisma/schema.prisma --accept-data-loss && bun run --smol src/index.ts"]
