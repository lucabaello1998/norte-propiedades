import type { MetadataRoute } from "next";
import { apiGetOr } from "@/lib/api";
import { site } from "@/lib/site";
import type { Paginated, Property } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const list = await apiGetOr<Paginated<Property>>("/api/properties?limit=100", { items: [], total: 0 });

  const properties: MetadataRoute.Sitemap = list.items.map((property) => ({
    url: `${site.url}/propiedades/${property.slug}`,
    lastModified: property.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: site.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/propiedades`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...properties,
  ];
}
