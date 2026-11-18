import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { FastifyPluginAsync } from "fastify";
import sharp from "sharp";
import { z } from "zod";
import { requireAuth } from "../auth";
import { config } from "../env";
import { mapProperty, pool, slugify, type PropertyRow } from "../db";

const imagePath = z
  .string()
  .min(1)
  .max(500)
  .refine(
    (value) =>
      value.startsWith("/images/") ||
      value.startsWith("/media/") ||
      value.startsWith("https://"),
    "La imagen debe ser una ruta interna o una URL https",
  );

const propertySchema = z.object({
  title: z.string().trim().min(5).max(160),
  slug: z.string().trim().max(160).optional(),
  operation: z.enum(["venta", "alquiler"]),
  type: z.enum(["casa", "departamento", "ph", "duplex", "terreno", "local"]),
  neighborhood: z.string().trim().min(2).max(80),
  address: z.string().trim().max(160).nullable().optional(),
  price: z.number().min(0).max(999_999_999),
  currency: z.enum(["USD", "ARS"]),
  expenses: z.number().min(0).max(999_999_999).default(0),
  bedrooms: z.number().int().min(0).max(30).default(0),
  bathrooms: z.number().int().min(0).max(30).default(0),
  garages: z.number().int().min(0).max(30).default(0),
  area_m2: z.number().int().positive().max(100_000).nullable().optional(),
  lot_m2: z.number().int().positive().max(1_000_000).nullable().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["disponible", "reservada", "vendida", "alquilada"]).default("disponible"),
  description: z.string().trim().max(5000).default(""),
  amenities: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  images: z.array(imagePath).max(12).default([]),
});

type PropertyInput = z.infer<typeof propertySchema>;

function valuesOf(data: PropertyInput, slug: string) {
  return [
    slug,
    data.title,
    data.operation,
    data.type,
    data.neighborhood,
    data.address || null,
    data.price,
    data.currency,
    data.expenses,
    data.bedrooms,
    data.bathrooms,
    data.garages,
    data.area_m2 ?? null,
    data.lot_m2 ?? null,
    data.featured,
    data.status,
    data.description,
    data.amenities,
    data.images,
  ];
}

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/api/admin/properties", { preHandler: requireAuth }, async () => {
    const { rows } = await pool.query<PropertyRow>(
      "SELECT * FROM properties ORDER BY created_at DESC",
    );
    return { items: rows.map(mapProperty) };
  });

  fastify.get("/api/admin/properties/:id", { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { rows } = await pool.query<PropertyRow>("SELECT * FROM properties WHERE id = $1", [id]);
    if (rows.length === 0) {
      return reply.code(404).send({ error: "Propiedad no encontrada" });
    }
    return mapProperty(rows[0]);
  });

  fastify.post("/api/admin/properties", { preHandler: requireAuth }, async (request, reply) => {
    const parsed = propertySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: "Revisá los datos",
        issues: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      });
    }
    const data = parsed.data;
    const slug = slugify(data.slug || data.title);
    if (!slug) {
      return reply.code(400).send({ error: "El título no genera un slug válido" });
    }

    try {
      const { rows } = await pool.query<PropertyRow>(
        `INSERT INTO properties
          (slug, title, operation, type, neighborhood, address, price, currency, expenses,
           bedrooms, bathrooms, garages, area_m2, lot_m2, featured, status, description, amenities, images)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
         RETURNING *`,
        valuesOf(data, slug),
      );
      return reply.code(201).send(mapProperty(rows[0]));
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        return reply.code(409).send({ error: "Ya existe una propiedad con ese slug" });
      }
      throw error;
    }
  });

  fastify.put("/api/admin/properties/:id", { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = propertySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: "Revisá los datos",
        issues: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      });
    }
    const data = parsed.data;
    const slug = slugify(data.slug || data.title);

    try {
      const { rows } = await pool.query<PropertyRow>(
        `UPDATE properties SET
           slug=$1, title=$2, operation=$3, type=$4, neighborhood=$5, address=$6,
           price=$7, currency=$8, expenses=$9, bedrooms=$10, bathrooms=$11, garages=$12,
           area_m2=$13, lot_m2=$14, featured=$15, status=$16, description=$17,
           amenities=$18, images=$19
         WHERE id=$20
         RETURNING *`,
        [...valuesOf(data, slug), id],
      );
      if (rows.length === 0) {
        return reply.code(404).send({ error: "Propiedad no encontrada" });
      }
      return mapProperty(rows[0]);
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        return reply.code(409).send({ error: "Ya existe una propiedad con ese slug" });
      }
      throw error;
    }
  });

  fastify.delete("/api/admin/properties/:id", { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { rowCount } = await pool.query("DELETE FROM properties WHERE id = $1", [id]);
    if (!rowCount) {
      return reply.code(404).send({ error: "Propiedad no encontrada" });
    }
    return reply.code(204).send();
  });

  fastify.post(
    "/api/admin/uploads",
    { preHandler: requireAuth, config: { rateLimit: { max: 20, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const file = await request.file();
      if (!file) {
        return reply.code(400).send({ error: "Falta el archivo" });
      }
      const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
      if (!allowed.has(file.mimetype)) {
        return reply.code(400).send({ error: "Formato no permitido (JPEG, PNG, WebP o AVIF)" });
      }

      const buffer = await file.toBuffer();
      await mkdir(config.uploadDir, { recursive: true });
      const filename = `${randomUUID()}.webp`;
      const destination = path.join(config.uploadDir, filename);

      await sharp(buffer)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(destination);

      return { url: `/media/${filename}` };
    },
  );
};

export default adminRoutes;
