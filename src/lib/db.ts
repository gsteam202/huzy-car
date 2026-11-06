import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function safeDecode(val: string): string {
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

function createPrismaClient(): PrismaClient {
  const urlString = process.env.DATABASE_URL;
  if (!urlString) {
    throw new Error("DATABASE_URL is not set");
  }

  const url = new URL(urlString);
  const useSsl =
    url.searchParams.get("ssl") === "true" ||
    url.searchParams.get("sslaccept") === "strict" ||
    process.env.DB_SSL === "true" ||
    process.env.DB_SSL === "1";

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: safeDecode(url.username),
    password: safeDecode(url.password),
    database: url.pathname.slice(1),
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
    connectTimeout: 5000,
    idleTimeout: Number(process.env.DB_IDLE_TIMEOUT_SECONDS || 60),
    minimumIdle: Number(process.env.DB_MINIMUM_IDLE || 0),
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;

