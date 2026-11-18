export type Operation = "venta" | "alquiler";
export type PropertyType = "casa" | "departamento" | "ph" | "duplex" | "terreno" | "local";
export type PropertyStatus = "disponible" | "reservada" | "vendida" | "alquilada";

export type Property = {
  id: number;
  slug: string;
  title: string;
  operation: Operation;
  type: PropertyType;
  neighborhood: string;
  address: string | null;
  price: number;
  currency: "USD" | "ARS";
  expenses: number;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  area_m2: number | null;
  lot_m2: number | null;
  featured: boolean;
  status: PropertyStatus;
  description: string;
  amenities: string[];
  images: string[];
  created_at: string;
  updated_at: string;
};

export type Neighborhood = {
  neighborhood: string;
  count: number;
};

export type Lead = {
  id: number;
  property_id: number | null;
  property_title: string | null;
  property_slug: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: "nuevo" | "contactado" | "cerrado";
  created_at: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
};
