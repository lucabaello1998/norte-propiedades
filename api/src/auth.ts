import { createHash, timingSafeEqual } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { config } from "./env";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function verifyCredentials(email: string, password: string): boolean {
  const emailOk = email.trim().toLowerCase() === config.adminEmail;
  const passwordOk = timingSafeEqual(digest(password), digest(config.adminPassword));
  return emailOk && passwordOk;
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true });
  } catch {
    return reply.code(401).send({ error: "No autorizado" });
  }
}

export const cookieName = "np_session";
