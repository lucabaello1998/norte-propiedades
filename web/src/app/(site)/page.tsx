import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { Reveal } from "@/components/reveal";
import { SearchForm } from "@/components/search-form";
import { apiGetOr } from "@/lib/api";
import { site, whatsappLink } from "@/lib/site";
import type { Neighborhood, Paginated, Property } from "@/lib/types";

export const dynamic = "force-dynamic";

const values = [
  {
    number: "01",
    title: "Fotos reales, datos claros",
    text: "Cada propiedad se publica con medidas, estado y ubicación verificados. Sin sorpresas cuando llegás a la puerta.",
  },
  {
    number: "02",
    title: "Respondemos el mismo día",
    text: "Una persona del equipo te contesta, no un bot. Coordinamos visitas en menos de 48 horas.",
  },
  {
    number: "03",
    title: "Te acompañamos hasta la firma",
    text: "Desde la primera visita hasta la escritura: documentación, negociación y seguimiento con tu escribanía.",
  },
];

export default async function HomePage() {
  const [featured, neighborhoods] = await Promise.all([
    apiGetOr<Paginated<Property>>("/api/properties?featured=true&limit=4", { items: [], total: 0 }),
    apiGetOr<{ items: Neighborhood[] }>("/api/neighborhoods", { items: [] }),
  ]);

  const properties = featured.items;
  const barrios = neighborhoods.items;

  return (
    <>
      <section className="relative flex min-h-[90svh] flex-col justify-end overflow-hidden">
        <Image
          src="/images/foto-01.jpg"
          alt="Casa moderna con jardín en zona oeste"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/65 to-transparent" />

        <div className="container-page relative z-10 pb-24 pt-36 text-cream sm:pb-28">
          <p className="eyebrow text-cream/60">El Palomar · Haedo · Morón · Castelar · Ramos Mejía</p>
          <h1 className="mt-5 max-w-4xl text-balance font-display text-[clamp(2.7rem,7.6vw,6.4rem)] leading-[0.94] tracking-[-0.04em]">
            Encontrá <em className="italic text-[#eac9b6]">tu lugar</em> en zona oeste.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-sm leading-relaxed text-cream/75 sm:text-base">
            Casas, PH y departamentos con fotos reales y datos claros. Te acompañamos desde la
            primera visita hasta las llaves.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cream/55">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} /> {site.years} años en la zona
            </span>
            <span className="flex items-center gap-2">
              <Check size={14} /> Acompañamiento hasta la firma
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} /> Respuesta en el día
            </span>
          </div>
        </div>
      </section>

      <div className="container-page relative z-20 -mt-14 sm:-mt-16">
        <Reveal>
          <SearchForm neighborhoods={barrios.map((item) => item.neighborhood)} />
        </Reveal>
      </div>

      <section className="container-page pt-24 lg:pt-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Selección de la semana</p>
            <h2 className="mt-3 text-balance text-4xl tracking-[-0.03em] sm:text-5xl">
              Propiedades destacadas
            </h2>
          </div>
          <Link href="/propiedades" className="link-arrow">
            Ver todas las propiedades <ArrowUpRight size={16} />
          </Link>
        </Reveal>

        {properties.length > 0 ? (
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
            {properties.map((property, index) => (
              <Reveal
                key={property.id}
                delay={index * 70}
                className={
                  index === 0
                    ? "lg:col-span-7"
                    : index === 1
                      ? "lg:col-span-5"
                      : "lg:col-span-6"
                }
              >
                <PropertyCard property={property} large={index === 0} priority={index === 0} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-9 rounded-[1.25rem] border border-line bg-cream p-10 text-center">
            <p className="font-display text-2xl">Estamos actualizando la selección</p>
            <p className="mt-2 text-sm text-muted">Volvé en un rato o mirá todas las propiedades disponibles.</p>
            <Link href="/propiedades" className="btn btn-primary mt-5">
              Ver propiedades
            </Link>
          </div>
        )}
      </section>

      <section id="barrios" className="mt-24 border-y border-line/80 bg-paper-2/60 py-20 lg:mt-28 lg:py-24">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Mapa de la zona</p>
            <h2 className="mt-3 text-balance text-4xl tracking-[-0.03em] sm:text-5xl">
              Barrios que conocemos de memoria
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted">
              No vendemos un código postal: sabemos qué cuadras son tranquilas, dónde conviene
              invertir y qué está por cambiar.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {barrios.map((barrio, index) => (
              <Reveal key={barrio.neighborhood} delay={index * 50}>
                <Link
                  href={`/propiedades?neighborhood=${encodeURIComponent(barrio.neighborhood)}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-line/80 bg-cream px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest hover:bg-forest hover:text-cream"
                >
                  <span>
                    <span className="font-display text-2xl tracking-tight">{barrio.neighborhood}</span>
                    <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted transition-colors group-hover:text-cream/55">
                      {barrio.count} propiedad{barrio.count === 1 ? "" : "es"}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cream"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="container-page py-20 lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-paper-3">
              <Image
                src="/images/foto-06.jpg"
                alt="Casa de zona oeste con jardín y entrada de madera"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-cream/95 p-5 backdrop-blur">
                <p className="font-display text-4xl tracking-tight">{site.years} años</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  viviendo y trabajando en la misma zona que vos.
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow">Cómo trabajamos</p>
              <h2 className="mt-3 max-w-xl text-balance text-4xl leading-[1.02] tracking-[-0.03em] sm:text-5xl">
                No somos un portal. Somos el vecino que sabe qué hay detrás de cada puerta.
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted">
                Trabajamos con pocas propiedades a la vez para poder conocerlas de verdad. Eso nos
                permite responderte rápido, mostrarte lo que importa y decirte que no cuando algo
                no encaja.
              </p>
            </Reveal>

            <div className="mt-10 space-y-0">
              {values.map((value, index) => (
                <Reveal key={value.number} delay={index * 80}>
                  <div className="grid gap-4 border-t border-line py-6 sm:grid-cols-[auto_1fr] sm:gap-8">
                    <span className="font-display text-2xl text-accent">{value.number}</span>
                    <div>
                      <h3 className="text-xl tracking-tight">{value.title}</h3>
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{value.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-forest py-20 text-cream lg:py-24">
        <div className="container-page">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="mx-auto grid size-11 place-items-center rounded-full border border-cream/20">
              <Sparkles size={18} />
            </span>
            <blockquote className="mt-7 text-balance font-display text-3xl leading-[1.15] tracking-[-0.02em] sm:text-4xl">
              “Vendimos en tres semanas y con un acompañamiento que no esperábamos. Nos explicaron
              cada paso, sin apuro y sin letra chica.”
            </blockquote>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-cream/55">
              Florencia y Martín · Castelar
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <Image
          src="/images/foto-09.jpg"
          alt="Casa con pileta y jardín"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="container-page relative z-10 py-20 text-cream lg:py-28">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-cream/55">Vendé o alquilá con nosotros</p>
            <h2 className="mt-3 text-balance text-4xl leading-[1.02] tracking-[-0.03em] sm:text-5xl">
              ¿Tenés una propiedad para vender o alquilar?
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-sm leading-relaxed text-cream/70">
              Hacemos una tasación sin cargo, te decimos qué conviene arreglar antes de publicar y
              armamos un plan con fechas claras. Sin compromiso.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink("Hola, quiero pedir una tasación sin cargo.")}
                target="_blank"
                rel="noreferrer"
                className="btn btn-accent"
              >
                <MessageCircle size={16} />
                Pedir tasación
              </a>
              <Link href="/propiedades" className="btn border border-cream/25 text-cream hover:bg-cream/10">
                Ver propiedades
                <ArrowRight size={15} />
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cream/45">
              <MapPin size={13} /> {site.address} · {site.hours}
            </p>
          </Reveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: site.name,
            description: site.description,
            url: site.url,
            telephone: site.phone,
            areaServed: barrios.map((barrio) => barrio.neighborhood),
            address: {
              "@type": "PostalAddress",
              addressLocality: "El Palomar",
              addressRegion: "Buenos Aires",
              addressCountry: "AR",
            },
          }),
        }}
      />
    </>
  );
}
