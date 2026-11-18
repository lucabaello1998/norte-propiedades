"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { formatPrice, operationLabel, typeLabel } from "@/lib/format";
import type { Property } from "@/lib/types";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/properties");
    if (!response.ok) {
      setError("No pudimos cargar las propiedades.");
      setLoading(false);
      return;
    }
    const data = (await response.json()) as { items: Property[] };
    setProperties(data.items);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(property: Property) {
    if (!window.confirm(`¿Eliminar "${property.title}"? Esta acción no se puede deshacer.`)) return;
    const response = await fetch(`/api/admin/properties/${property.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("No pudimos eliminar la propiedad.");
      return;
    }
    setProperties((items) => items.filter((item) => item.id !== property.id));
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">Gestión</p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.03em]">Propiedades</h1>
          <p className="mt-2 text-sm text-muted">{properties.length} en total.</p>
        </div>
        <Link href="/admin/propiedades/nueva" className="btn btn-primary">
          <Plus size={16} />
          Nueva propiedad
        </Link>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-accent/25 bg-accent/5 px-4 py-3 text-sm text-accent-dark">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid h-64 place-items-center">
          <Loader2 size={22} className="animate-spin text-muted" />
        </div>
      ) : properties.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-cream px-6 py-14 text-center">
          <p className="font-display text-2xl">Todavía no hay propiedades</p>
          <p className="mt-2 text-sm text-muted">Creá la primera para que aparezca en el sitio.</p>
          <Link href="/admin/propiedades/nueva" className="btn btn-primary mt-5">
            <Plus size={16} />
            Crear propiedad
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-7 hidden overflow-hidden rounded-2xl border border-line bg-cream lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper-2/60 text-[0.65rem] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-bold">Propiedad</th>
                  <th className="px-4 py-3 font-bold">Operación</th>
                  <th className="px-4 py-3 font-bold">Precio</th>
                  <th className="px-4 py-3 font-bold">Estado</th>
                  <th className="px-4 py-3 font-bold">Destacada</th>
                  <th className="px-4 py-3 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {properties.map((property) => (
                  <tr key={property.id} className="transition-colors hover:bg-paper/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-paper-3">
                          {property.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={property.images[0]} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-xs truncate font-semibold">{property.title}</p>
                          <p className="text-xs text-muted">
                            {typeLabel[property.type]} · {property.neighborhood}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{operationLabel[property.operation]}</td>
                    <td className="px-4 py-3 text-xs font-semibold">{formatPrice(property)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-paper-2 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ink-2">
                        {property.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {property.featured ? (
                        <Star size={15} className="fill-accent text-accent" />
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          href={`/admin/propiedades/${property.id}`}
                          className="grid size-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-forest hover:text-forest"
                          aria-label={`Editar ${property.title}`}
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => void remove(property)}
                          className="grid size-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                          aria-label={`Eliminar ${property.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-3 lg:hidden">
            {properties.map((property) => (
              <article key={property.id} className="rounded-2xl border border-line bg-cream p-3">
                <div className="flex gap-3">
                  <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-paper-3">
                    {property.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={property.images[0]} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold">{property.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {operationLabel[property.operation]} · {formatPrice(property)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-paper-2 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-ink-2">
                        {property.status}
                      </span>
                      {property.featured && <Star size={13} className="fill-accent text-accent" />}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 border-t border-line pt-3">
                  <Link href={`/admin/propiedades/${property.id}`} className="btn btn-ghost flex-1 py-2 text-xs">
                    <Pencil size={13} />
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => void remove(property)}
                    className="btn btn-ghost px-3 py-2 text-xs text-accent"
                    aria-label={`Eliminar ${property.title}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
