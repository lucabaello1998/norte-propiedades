import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Car, MapPin, Ruler } from "lucide-react";
import { formatPrice, operationLabel, typeLabel } from "@/lib/format";
import type { Property } from "@/lib/types";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
  large?: boolean;
};

export function PropertyCard({ property, priority = false, large = false }: PropertyCardProps) {
  const cover = property.images[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line/70 bg-cream shadow-[0_18px_40px_-30px_rgba(21,26,22,.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(21,26,22,.4)]">
      <Link
        href={`/propiedades/${property.slug}`}
        className="zoom-media relative block overflow-hidden bg-paper-3"
        style={{ aspectRatio: large ? "4 / 3" : "4 / 3" }}
        aria-label={`Ver ${property.title}`}
      >
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            priority={priority}
            sizes={large ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-paper-3" />
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-cream/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur">
            {operationLabel[property.operation]}
          </span>
          {property.status === "reservada" && (
            <span className="rounded-full bg-accent px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white">
              Reservada
            </span>
          )}
          {property.featured && property.status === "disponible" && (
            <span className="rounded-full bg-ink/80 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur">
              Destacada
            </span>
          )}
        </div>
        <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-cream/95 text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[1.05rem] font-bold tracking-tight">{formatPrice(property)}</p>
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted">
            {typeLabel[property.type]}
          </span>
        </div>

        <h3 className={`mt-1.5 font-display leading-snug ${large ? "text-2xl" : "text-xl"}`}>
          <Link href={`/propiedades/${property.slug}`} className="transition-colors hover:text-accent">
            {property.title}
          </Link>
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={12} className="shrink-0" />
          {property.neighborhood}
          {property.address ? ` · ${property.address}` : ""}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/70 pt-3.5 text-[0.72rem] text-ink-2">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={13} className="text-muted" /> {property.bedrooms} dorm.
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath size={13} className="text-muted" /> {property.bathrooms} baño{property.bathrooms > 1 ? "s" : ""}
            </span>
          )}
          {property.area_m2 ? (
            <span className="flex items-center gap-1.5">
              <Ruler size={13} className="text-muted" /> {property.area_m2} m²
            </span>
          ) : null}
          {property.garages > 0 && (
            <span className="flex items-center gap-1.5">
              <Car size={13} className="text-muted" /> {property.garages}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-line/70 bg-cream">
      <div className="aspect-[4/3] animate-pulse bg-paper-3" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-24 animate-pulse rounded bg-paper-3" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-paper-3" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-paper-3" />
      </div>
    </div>
  );
}
