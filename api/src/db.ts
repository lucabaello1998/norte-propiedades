import { Pool } from "pg";
import { config } from "./env";

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on("error", (error) => {
  console.error("Error inesperado en el pool de Postgres", error);
});

export type Operation = "venta" | "alquiler";
export type PropertyType = "casa" | "departamento" | "ph" | "duplex" | "terreno" | "local";
export type PropertyStatus = "disponible" | "reservada" | "vendida" | "alquilada";

export type PropertyRow = {
  id: number;
  slug: string;
  title: string;
  operation: Operation;
  type: PropertyType;
  neighborhood: string;
  address: string | null;
  price: string;
  currency: "USD" | "ARS";
  expenses: string;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  area_m2: number | null;
  lot_m2: number | null;
  featured: boolean;
  status: PropertyStatus;
  description: string;
  amenities: string[] | null;
  images: string[] | null;
  created_at: Date;
  updated_at: Date;
};

export type Property = Omit<PropertyRow, "price" | "expenses" | "amenities" | "images" | "created_at" | "updated_at"> & {
  price: number;
  expenses: number;
  amenities: string[];
  images: string[];
  created_at: string;
  updated_at: string;
};

export function mapProperty(row: PropertyRow): Property {
  return {
    ...row,
    price: Number(row.price),
    expenses: Number(row.expenses),
    amenities: row.amenities ?? [],
    images: row.images ?? [],
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
