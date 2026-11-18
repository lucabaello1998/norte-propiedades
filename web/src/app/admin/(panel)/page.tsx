"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Loader2,
  MessageSquare,
  Plus,
  Star,
} from "lucide-react";
import { formatDateTime, formatPrice, operationLabel } from "@/lib/format";
import type { Lead, Property } from "@/lib/types";

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/properties").then((response) => response.json()),
      fetch("/api/admin/leads").then((response) => response.json()),
    ])
      .then(([propertyData, leadData]) => {
        setProperties(propertyData.items ?? []);
        setLeads(leadData.items ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const nuevos = leads.filter((lead) => lead.status === "nuevo").length;
  const featured = properties.filter((property) => property.featured).length;
  const latest = leads.slice(0, 5);

  if (loading) {
    return (
      <div className="grid h-64 place-items-center">
        <Loader2 size={22} className="animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">Resumen</p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.03em]">Buen día, Luca</h1>
          <p className="mt-2 text-sm text-muted">Esto es lo que está pasando en el sitio hoy.</p>
        </div>
        <Link href="/admin/propiedades/nueva" className="btn btn-primary">
          <Plus size={16} />
          Nueva propiedad
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Propiedades</p>
            <Building2 size={17} className="text-muted" />
          </div>
          <p className="mt-3 font-display text-4xl">{properties.length}</p>
          <p className="mt-1 text-xs text-muted">publicadas en el sitio</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Destacadas</p>
            <Star size={17} className="text-muted" />
          </div>
          <p className="mt-3 font-display text-4xl">{featured}</p>
          <p className="mt-1 text-xs text-muted">en la home</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Consultas nuevas</p>
            <MessageSquare size={17} className="text-muted" />
          </div>
          <p className="mt-3 font-display text-4xl">{nuevos}</p>
          <p className="mt-1 text-xs text-muted">sin responder todavía</p>
        </div>
        <div className="rounded-2xl border border-line bg-forest p-5 text-cream">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cream/55">Total consultas</p>
            <MessageSquare size={17} className="text-cream/55" />
          </div>
          <p className="mt-3 font-display text-4xl">{leads.length}</p>
          <p className="mt-1 text-xs text-cream/55">desde el inicio del demo</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-line bg-cream">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-lg tracking-tight">Últimas consultas</h2>
            <Link href="/admin/consultas" className="link-arrow text-xs">
              Ver todas <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-line">
            {latest.length === 0 && <p className="px-5 py-8 text-sm text-muted">Todavía no hay consultas.</p>}
            {latest.map((lead) => (
              <div key={lead.id} className="flex items-start justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{lead.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {lead.property_title ?? "Consulta general"} · {formatDateTime(lead.created_at)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] ${
                    lead.status === "nuevo"
                      ? "bg-accent/10 text-accent-dark"
                      : lead.status === "contactado"
                        ? "bg-forest/10 text-forest"
                        : "bg-paper-3 text-muted"
                  }`}
                >
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-5">
          <h2 className="text-lg tracking-tight">Propiedades recientes</h2>
          <div className="mt-4 space-y-3">
            {properties.slice(0, 4).map((property) => (
              <Link
                key={property.id}
                href={`/admin/propiedades/${property.id}`}
                className="flex items-center gap-3 rounded-xl border border-line/80 p-2.5 transition-colors hover:border-forest/40 hover:bg-paper"
              >
                <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-paper-3">
                  {property.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={property.images[0]} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{property.title}</p>
                  <p className="truncate text-xs text-muted">
                    {operationLabel[property.operation]} · {formatPrice(property)}
                  </p>
                </div>
                <ArrowUpRight size={15} className="shrink-0 text-muted" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
