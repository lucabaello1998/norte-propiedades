import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3002),
  host: process.env.HOST ?? "0.0.0.0",
  databaseUrl: required("DATABASE_URL"),
  adminEmail: (process.env.ADMIN_EMAIL ?? "demo@nortepropiedades.com").toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD ?? "norte2026",
  jwtSecret: process.env.JWT_SECRET ?? "cambiar-este-secreto-en-produccion",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  uploadDir: process.env.UPLOAD_DIR ?? "/data/uploads",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 6),
  publicSiteUrl: process.env.PUBLIC_SITE_URL ?? "http://localhost:3105",
};
