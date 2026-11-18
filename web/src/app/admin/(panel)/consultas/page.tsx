"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2, Mail, MessageCircle, Phone } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { Lead } from "@/lib/types";

const filters = ["todas", "nuevo", "contactado", "cerrado"] as const;
type Filter = (typeof filters)[number];

const statusStyle: Record<Lead["status"], string> = {
  nuevo: "bg-accent/10 text-accent-dark",
  contactado: "bg-forest/10 text-forest",
  cerrado: "bg-paper-3 text-muted",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<Filter>("todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((response) => response.json())
      .then((data: { items: Lead[] }) => setLeads(data.items ?? []))
      .catch(() => setError("No pudimos cargar las consultas."))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: number, status: Lead["status"]) {
    const previous = leads;
    setLeads((items) => items.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      setLeads(previous);
      setError("No pudimos actualizar el estado.");
    }
  }

  const visible = filter === "todas" ? leads : leads.filter((lead) => lead.status === filter);
  const counts = {
    todas: leads.length,
    nuevo: leads.filter((lead) => lead.status === "nuevo").length,
    contactado: leads.filter((lead) => lead.status === "contactado").length,
    cerrado: leads.filter((lead) => lead.status === "cerrado").length,
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">Bandeja</p>
        <h1 className="mt-2 font-display text-4xl tracking-[-0.03em]">Consultas</h1>
        <p className="mt-2 text-sm text-muted">
          Todas las consultas que llegan desde el sitio, en un solo lugar.
        </p>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-accent/25 bg-accent/5 px-4 py-3 text-sm text-accent-dark">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${
              filter === item
                ? "border-ink bg-ink text-cream"
                : "border-line bg-cream text-muted hover:border-ink/30 hover:text-ink"
            }`}
          >
            {item} ({counts[item]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid h-64 place-items-center">
          <Loader2 size={22} className="animate-spin text-muted" />
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-cream px-6 py-14 text-center">
          <p className="font-display text-2xl">No hay consultas en esta categoría</p>
          <p className="mt-2 text-sm text-muted">Cuando alguien complete el formulario, aparece acá.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {visible.map((lead) => (
            <article key={lead.id} className="rounded-2xl border border-line bg-cream p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold">{lead.name}</h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] ${statusStyle[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{formatDateTime(lead.created_at)}</p>
                </div>

                <select
                  value={lead.status}
                  onChange={(event) => void updateStatus(lead.id, event.target.value as Lead["status"])}
                  className="field w-auto py-2 text-xs"
                  aria-label={`Estado de la consulta de ${lead.name}`}
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="contactado">Contactado</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>

              {lead.property_title && lead.property_slug && (
                <Link
                  href={`/propiedades/${lead.property_slug}`}
                  target="_blank"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1 text-[0.68rem] font-semibold text-ink-2 transition-colors hover:bg-paper-3"
                >
                  {lead.property_title}
                  <ArrowUpRight size={12} />
                </Link>
              )}

              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-2">{lead.message}</p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                <a
                  href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-2 hover:border-forest hover:text-forest"
                >
                  <Phone size={13} />
                  {lead.phone}
                </a>
                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-2 hover:border-forest hover:text-forest"
                >
                  <MessageCircle size={13} />
                  WhatsApp
                </a>
                {lead.email && (
                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-ink-2 hover:border-forest hover:text-forest"
                  >
                    <Mail size={13} />
                    {lead.email}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
