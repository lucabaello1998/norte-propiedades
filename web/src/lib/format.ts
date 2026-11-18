import type { Operation, Property, PropertyType } from "./types";

const number = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export function formatPrice(property: Pick<Property, "price" | "currency">): string {
  const prefix = property.currency === "USD" ? "US$" : "$";
  return `${prefix} ${number.format(property.price)}`;
}

export function formatExpenses(property: Pick<Property, "expenses" | "currency">): string {
  if (!property.expenses) return "";
  const prefix = property.currency === "USD" ? "US$" : "$";
  return `+ ${prefix} ${number.format(property.expenses)} expensas`;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export const operationLabel: Record<Operation, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
};

export const typeLabel: Record<PropertyType, string> = {
  casa: "Casa",
  departamento: "Departamento",
  ph: "PH",
  duplex: "Dúplex",
  terreno: "Terreno",
  local: "Local",
};

export function specs(property: Property): string[] {
  const items: string[] = [];
  if (property.bedrooms) items.push(`${property.bedrooms} dorm.`);
  if (property.bathrooms) items.push(`${property.bathrooms} baño${property.bathrooms > 1 ? "s" : ""}`);
  if (property.area_m2) items.push(`${property.area_m2} m²`);
  if (property.garages) items.push(`${property.garages} cochera${property.garages > 1 ? "s" : ""}`);
  return items;
}
