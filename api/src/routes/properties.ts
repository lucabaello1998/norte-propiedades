import type { FastifyPluginAsync } from "fastify";
import { mapProperty, pool, type PropertyRow } from "../db";

type ListQuery = {
  operation?: string;
  type?: string;
  neighborhood?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
  featured?: string;
  limit?: string;
};

const propertiesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/api/properties", async (request) => {
    const query = request.query as ListQuery;
    const where: string[] = ["status IN ('disponible', 'reservada')"];
    const params: unknown[] = [];

    if (query.operation === "venta" || query.operation === "alquiler") {
      params.push(query.operation);
      where.push(`operation = $${params.length}`);
    }
    if (query.type) {
      params.push(query.type);
      where.push(`type = $${params.length}`);
    }
    if (query.neighborhood) {
      params.push(query.neighborhood);
      where.push(`neighborhood = $${params.length}`);
    }
    if (query.minPrice && Number.isFinite(Number(query.minPrice))) {
      params.push(Number(query.minPrice));
      where.push(`price >= $${params.length}`);
    }
    if (query.maxPrice && Number.isFinite(Number(query.maxPrice))) {
      params.push(Number(query.maxPrice));
      where.push(`price <= $${params.length}`);
    }
    if (query.q?.trim()) {
      params.push(`%${query.q.trim()}%`);
      const i = params.length;
      where.push(`(title ILIKE $${i} OR neighborhood ILIKE $${i} OR description ILIKE $${i})`);
    }
    if (query.featured === "true") {
      where.push("featured = TRUE");
    }

    const limit = Math.min(Math.max(Number(query.limit) || 60, 1), 100);
    params.push(limit);

    const sql = `
      SELECT * FROM properties
      WHERE ${where.join(" AND ")}
      ORDER BY featured DESC, created_at DESC
      LIMIT $${params.length}
    `;
    const { rows } = await pool.query<PropertyRow>(sql, params);
    return { items: rows.map(mapProperty), total: rows.length };
  });

  fastify.get("/api/properties/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const { rows } = await pool.query<PropertyRow>(
      "SELECT * FROM properties WHERE slug = $1",
      [slug],
    );
    if (rows.length === 0) {
      return reply.code(404).send({ error: "Propiedad no encontrada" });
    }
    return mapProperty(rows[0]);
  });

  fastify.get("/api/neighborhoods", async () => {
    const { rows } = await pool.query<{ neighborhood: string; count: number }>(
      `SELECT neighborhood, COUNT(*)::int AS count
       FROM properties
       WHERE status IN ('disponible', 'reservada')
       GROUP BY neighborhood
       ORDER BY count DESC, neighborhood ASC`,
    );
    return { items: rows };
  });
};

export default propertiesRoutes;
