import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Bath,
  BedDouble,
  Car,
  Check,
  MapPin,
  MessageCircle,
  Ruler,
  Trees,
  type LucideIcon,
} from "lucide-react";
import { Gallery } from "@/components/gallery";
import { LeadForm } from "@/components/lead-form";
import { MobileCta } from "@/components/mobile-cta";
import { PropertyCard } from "@/components/property-card";
import { Reveal } from "@/components/reveal";
import { apiGet, apiGetOr } from "@/lib/api";
import { formatExpenses, formatPrice, operationLabel, typeLabel } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import type { Paginated, Property } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

async function getProperty(slug: string): Promise<Property | null> {
  try {
    return await apiGet<Property>(`/api/properties/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: "Propiedad no encontrada" };

  return {
    title: property.title,
    description: `${typeLabel[property.type]} en ${property.neighborhood}. ${formatPrice(property)}. ${property.description.slice(0, 140)}`,
    openGraph: {
      title: property.title,
      description: `${typeLabel[property.type]} en ${property.neighborhood} · ${formatPrice(property)}`,
      images: property.images[0] ? [{ url: property.images[0] }] : undefined,
    },
  };
}

export default async function PropertyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const similar = await apiGetOr<Paginated<Property>>(
    `/api/properties?neighborhood=${encodeURIComponent(property.neighborhood)}&limit=5`,
    { items: [], total: 0 },
  );
  const related = similar.items.filter((item) => item.id !== property.id).slice(0, 3);

  const images = property.images.length > 0 ? property.images : ["/images/foto-01.jpg"];
  const mapQuery = encodeURIComponent(
    `${property.address ?? ""} ${property.neighborhood} Buenos Aires Argentina`.trim(),
  );

  const specs: { icon: LucideIcon; label: string }[] = [];
  if (property.bedrooms > 0) specs.push({ icon: BedDouble, label: `${property.bedrooms} dormitorios` });
  if (property.bathrooms > 0) specs.push({ icon: Bath, label: `${property.bathrooms} baños` });
  if (property.area_m2) specs.push({ icon: Ruler, label: `${property.area_m2} m² cubiertos` });
  if (property.lot_m2) specs.push({ icon: Trees, label: `${property.lot_m2} m² de lote` });
  if (property.garages > 0) specs.push({ icon: Car, label: `${property.garages} cocheras` });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${site.url}/propiedades/${property.slug}`,
    image: images.map((image) => `${site.url}${image}`),
    datePosted: property.created_at,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
      availability:
        property.status === "disponible"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address ?? undefined,
      addressLocality: property.neighborhood,
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
  };

  return (
    <div className="pb-24 pt-24 lg:pb-0 lg:pt-28">
      <div className="container-page">
        <nav className="flex flex-wrap items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
          <Link href="/" className="transition-colors hover:text-ink">
            Inicio
          </Link>
          <span className="text-line">/</span>
          <Link href="/propiedades" className="transition-colors hover:text-ink">
            Propiedades
          </Link>
          <span className="text-line">/</span>
          <span className="text-ink">{property.neighborhood}</span>
        </nav>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-ink px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-cream">
                {operationLabel[property.operation]}
              </span>
              <span className="rounded-full border border-line bg-cream px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted">
                {typeLabel[property.type]}
              </span>
              {property.status === "reservada" && (
                <span className="rounded-full bg-accent px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white">
                  Reservada
                </span>
              )}
            </div>
            <h1 className="mt-4 text-balance text-4xl tracking-[-0.03em] sm:text-5xl">
              {property.title}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <MapPin size={15} />
              {property.address ? `${property.address}, ` : ""}
              {property.neighborhood}, Buenos Aires
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="font-display text-4xl tracking-[-0.03em]">{formatPrice(property)}</p>
            {property.expenses > 0 && (
              <p className="mt-1 text-xs text-muted">{formatExpenses(property)}</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Gallery images={images} title={property.title} />
        </div>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1.55fr_1fr] lg:gap-16">
          <div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 border-y border-line py-6">
              {specs.map((spec) => (
                <span key={spec.label} className="flex items-center gap-2 text-sm text-ink-2">
                  <spec.icon size={17} className="text-accent" />
                  {spec.label}
                </span>
              ))}
            </div>

            <section className="mt-9">
              <h2 className="text-2xl tracking-tight">Sobre esta propiedad</h2>
              <p className="mt-4 whitespace-pre-line text-pretty text-sm leading-[1.8] text-ink-2">
                {property.description}
              </p>
            </section>

            {property.amenities.length > 0 && (
              <section className="mt-9">
                <h2 className="text-2xl tracking-tight">Lo que ofrece</h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {property.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-center gap-2.5 text-sm text-ink-2">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-forest/10 text-forest">
                        <Check size={12} />
                      </span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-9">
              <h2 className="text-2xl tracking-tight">Ubicación</h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="group relative mt-4 flex h-52 items-end overflow-hidden rounded-2xl border border-line bg-paper-2 p-5"
              >
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(#d8d0c1 1px, transparent 1px), linear-gradient(90deg, #d8d0c1 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                  }}
                />
                <div className="relative z-10 flex w-full items-center justify-between gap-4 rounded-xl bg-cream/95 px-4 py-3 backdrop-blur">
                  <span>
                    <span className="block text-sm font-semibold">
                      {property.address ?? property.neighborhood}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {property.neighborhood}, Buenos Aires
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-accent">
                    Ver en mapa
                    <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            </section>

            <div className="mt-10 rounded-2xl border border-line bg-cream p-5">
              <p className="text-xs leading-relaxed text-muted">
                Los datos de esta propiedad son de demostración. Las medidas, expensas y estado se
                confirman en la visita y en la documentación antes de cualquier reserva.
              </p>
            </div>
          </div>

          <aside id="consultar" className="lg:sticky lg:top-28">
            <div className="card-surface p-6 shadow-[0_24px_60px_-40px_rgba(21,26,22,.4)]">
              <p className="eyebrow">Consultá por esta propiedad</p>
              <p className="mt-2 font-display text-2xl tracking-tight">{formatPrice(property)}</p>
              <p className="mt-1 text-xs text-muted">
                {typeLabel[property.type]} en {property.neighborhood}
              </p>

              <div className="mt-5 border-t border-line pt-5">
                <LeadForm propertyId={property.id} propertyTitle={property.title} compact />
              </div>

              <div className="mt-5 border-t border-line pt-5">
                <a
                  href={whatsappLink(`Hola, me interesa ${property.title} (${property.neighborhood}).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm font-semibold transition-colors hover:border-forest hover:bg-forest hover:text-cream"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    Escribir por WhatsApp
                  </span>
                  <ArrowUpRight size={15} />
                </a>
                <p className="mt-3 text-center text-[0.68rem] text-muted">
                  {site.hours}
                </p>
              </div>
            </div>
          </aside>
        </div>

        <Link
          href="/propiedades"
          className="mt-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} />
          Volver a propiedades
        </Link>

        {related.length > 0 && (
          <section className="mt-16 border-t border-line pt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Misma zona</p>
                <h2 className="mt-2 text-3xl tracking-[-0.03em] sm:text-4xl">También te puede interesar</h2>
              </div>
              <Link href={`/propiedades?neighborhood=${encodeURIComponent(property.neighborhood)}`} className="link-arrow">
                Ver más en {property.neighborhood} <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 60} className="h-full">
                  <PropertyCard property={item} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      <MobileCta property={property} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
