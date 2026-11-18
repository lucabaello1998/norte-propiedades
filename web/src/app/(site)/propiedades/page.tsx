import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { Reveal } from "@/components/reveal";
import { SearchForm } from "@/components/search-form";
import { apiGetOr } from "@/lib/api";
import type { Neighborhood, Paginated, Property } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Propiedades en venta y alquiler",
  description:
    "Casas, PH y departamentos en El Palomar, Haedo, Morón, Castelar y Ramos Mejía. Filtrá por operación, tipo y barrio.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = {
    operation: first(params.operation),
    type: first(params.type),
    neighborhood: first(params.neighborhood),
    minPrice: first(params.minPrice),
    maxPrice: first(params.maxPrice),
    q: first(params.q),
  };

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) query.set(key, value);
  }
  query.set("limit", "60");

  const [list, neighborhoods] = await Promise.all([
    apiGetOr<Paginated<Property>>(`/api/properties?${query.toString()}`, { items: [], total: 0 }),
    apiGetOr<{ items: Neighborhood[] }>("/api/neighborhoods", { items: [] }),
  ]);

  const activeFilters = Object.entries(filters).filter(([, value]) => value);

  return (
    <div className="container-page pb-20 pt-28 lg:pt-32">
      <div className="max-w-2xl">
        <p className="eyebrow">Propiedades</p>
        <h1 className="mt-3 text-balance text-4xl tracking-[-0.03em] sm:text-5xl">
          Todas las propiedades
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Filtrá por operación, tipo de propiedad o barrio. Si no encontrás lo que buscás, escribinos:
          muchas propiedades se mueven antes de publicarse.
        </p>
      </div>

      <div className="mt-8">
        <SearchForm
          neighborhoods={neighborhoods.items.map((item) => item.neighborhood)}
          defaults={filters}
          variant="page"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-bold text-ink">{list.items.length}</span> propiedad
          {list.items.length === 1 ? "" : "es"} encontrada{list.items.length === 1 ? "" : "s"}
          {activeFilters.length > 0 ? " con los filtros aplicados" : ""}.
        </p>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map(([key, value]) => (
              <span
                key={key}
                className="rounded-full border border-line bg-cream px-2.5 py-1 text-[0.68rem] font-semibold text-muted"
              >
                {value}
              </span>
            ))}
          </div>
        )}
      </div>

      {list.items.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.items.map((property, index) => (
            <Reveal key={property.id} delay={Math.min(index, 6) * 50} className="h-full">
              <PropertyCard property={property} priority={index < 3} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-[1.25rem] border border-line bg-cream px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-paper-2 text-muted">
            <SearchX size={22} />
          </span>
          <h2 className="mt-5 font-display text-3xl">No encontramos nada con esos filtros</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Probá ampliar la búsqueda o quitá algún filtro. También podés escribirnos y te avisamos
            cuando entre algo que encaje.
          </p>
          <Link href="/propiedades" className="btn btn-primary mt-6">
            Ver todas las propiedades
          </Link>
        </div>
      )}
    </div>
  );
}
