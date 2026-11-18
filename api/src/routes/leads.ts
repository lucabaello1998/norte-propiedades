import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireAuth } from "../auth";
import { pool } from "../db";

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(1000).optional().default(""),
  propertyId: z.coerce.number().int().positive().optional().nullable(),
});

const statusSchema = z.object({
  status: z.enum(["nuevo", "contactado", "cerrado"]),
});

const leadsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/api/leads",
    { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const parsed = leadSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "Revisá los datos del formulario" });
      }
      const { name, phone, email, message, propertyId } = parsed.data;
      if (email && !emailRegex.test(email)) {
        return reply.code(400).send({ error: "El email no es válido" });
      }

      try {
        await pool.query(
          `INSERT INTO leads (property_id, name, phone, email, message)
           VALUES ($1, $2, $3, $4, $5)`,
          [propertyId ?? null, name, phone, email || null, message],
        );
      } catch (error) {
        const code = (error as { code?: string }).code;
        if (code === "23503") {
          return reply.code(400).send({ error: "La propiedad no existe" });
        }
        throw error;
      }

      return reply.code(201).send({ ok: true });
    },
  );

  fastify.get(
    "/api/admin/leads",
    { preHandler: requireAuth },
    async () => {
      const { rows } = await pool.query(
        `SELECT l.id, l.name, l.phone, l.email, l.message, l.status, l.created_at,
                l.property_id, p.title AS property_title, p.slug AS property_slug
         FROM leads l
         LEFT JOIN properties p ON p.id = l.property_id
         ORDER BY l.created_at DESC
         LIMIT 300`,
      );
      return { items: rows };
    },
  );

  fastify.patch(
    "/api/admin/leads/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = statusSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "Estado inválido" });
      }
      const { rowCount } = await pool.query(
        "UPDATE leads SET status = $1 WHERE id = $2",
        [parsed.data.status, id],
      );
      if (!rowCount) {
        return reply.code(404).send({ error: "Consulta no encontrada" });
      }
      return { ok: true };
    },
  );
};

export default leadsRoutes;
