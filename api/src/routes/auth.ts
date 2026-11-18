import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { cookieName, requireAuth, verifyCredentials } from "../auth";
import { config } from "../env";

const loginSchema = z.object({
  email: z.string().trim().min(3).max(120),
  password: z.string().min(1).max(200),
});

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/api/auth/login",
    { config: { rateLimit: { max: 8, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const parsed = loginSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "Datos incompletos" });
      }
      if (!verifyCredentials(parsed.data.email, parsed.data.password)) {
        return reply.code(401).send({ error: "Email o contraseña incorrectos" });
      }

      const token = fastify.jwt.sign({ sub: config.adminEmail }, { expiresIn: "12h" });
      reply.setCookie(cookieName, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: config.cookieSecure,
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return { ok: true, email: config.adminEmail };
    },
  );

  fastify.get("/api/auth/me", { preHandler: requireAuth }, async () => {
    return { email: config.adminEmail };
  });

  fastify.post("/api/auth/logout", async (_request, reply) => {
    reply.clearCookie(cookieName, { path: "/" });
    return { ok: true };
  });
};

export default authRoutes;
