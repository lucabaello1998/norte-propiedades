import { mkdir } from "node:fs/promises";
import Fastify, { type FastifyError } from "fastify";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import { cookieName } from "./auth";
import { pool } from "./db";
import { config } from "./env";
import adminRoutes from "./routes/admin";
import authRoutes from "./routes/auth";
import leadsRoutes from "./routes/leads";
import propertiesRoutes from "./routes/properties";

async function main() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
      redact: ["req.headers.cookie", "req.headers.authorization"],
    },
    trustProxy: true,
  });

  await app.register(cookie);
  await app.register(jwt, {
    secret: config.jwtSecret,
    cookie: { cookieName, signed: false },
  });
  await app.register(rateLimit, { global: false });
  await app.register(multipart, {
    limits: { fileSize: config.maxUploadMb * 1024 * 1024, files: 1 },
  });

  await mkdir(config.uploadDir, { recursive: true });
  await app.register(fastifyStatic, {
    root: config.uploadDir,
    prefix: "/media/",
    decorateReply: false,
    maxAge: "30d",
    immutable: true,
  });

  await app.register(propertiesRoutes);
  await app.register(leadsRoutes);
  await app.register(authRoutes);
  await app.register(adminRoutes);

  app.get("/api/health", async () => {
    await pool.query("SELECT 1");
    return { ok: true, service: "norte-propiedades-api" };
  });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error.code === "FST_REQ_FILE_TOO_LARGE") {
      return reply.code(413).send({ error: `La imagen supera los ${config.maxUploadMb} MB` });
    }
    const status = error.statusCode ?? 500;
    if (status >= 500) {
      request.log.error(error);
    }
    return reply.code(status).send({
      error: status >= 500 ? "Error interno del servidor" : error.message,
    });
  });

  const shutdown = async (signal: string) => {
    app.log.info(`Recibido ${signal}, cerrando`);
    await app.close();
    await pool.end();
    process.exit(0);
  };
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  await app.listen({ port: config.port, host: config.host });
  app.log.info(`API lista en http://${config.host}:${config.port}`);
}

main().catch((error) => {
  console.error("No se pudo iniciar la API", error);
  process.exit(1);
});
