"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImagePlus, Loader2, Save, Upload, X } from "lucide-react";
import type { Property } from "@/lib/types";

type PropertyFormProps = {
  property?: Property;
};

const inputLabel = "mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted";

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");

    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/uploads", { method: "POST", body });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "No pudimos subir la imagen.");
        continue;
      }
      const data = (await response.json()) as { url: string };
      setImages((current) => [...current, data.url]);
    }

    setUploading(false);
  }

  function addImageUrl() {
    const value = imageUrl.trim();
    if (!value) return;
    if (!value.startsWith("/images/") && !value.startsWith("/media/") && !value.startsWith("https://")) {
      setError("La URL debe empezar con /images/, /media/ o https://");
      return;
    }
    setImages((current) => [...current, value]);
    setImageUrl("");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");

    const data = new FormData(event.currentTarget);
    const number = (key: string) => Number(data.get(key) ?? 0);
    const optionalNumber = (key: string) => {
      const value = String(data.get(key) ?? "").trim();
      return value ? Number(value) : null;
    };

    const payload = {
      title: String(data.get("title") ?? ""),
      slug: String(data.get("slug") ?? ""),
      operation: String(data.get("operation") ?? "venta"),
      type: String(data.get("type") ?? "casa"),
      neighborhood: String(data.get("neighborhood") ?? ""),
      address: String(data.get("address") ?? "") || null,
      price: number("price"),
      currency: String(data.get("currency") ?? "USD"),
      expenses: number("expenses"),
      bedrooms: number("bedrooms"),
      bathrooms: number("bathrooms"),
      garages: number("garages"),
      area_m2: optionalNumber("area_m2"),
      lot_m2: optionalNumber("lot_m2"),
      featured: data.get("featured") === "on",
      status: String(data.get("status") ?? "disponible"),
      description: String(data.get("description") ?? ""),
      amenities: String(data.get("amenities") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      images,
    };

    const response = await fetch(
      property ? `/api/admin/properties/${property.id}` : "/api/admin/properties",
      {
        method: property ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "No pudimos guardar la propiedad.");
      setSending(false);
      return;
    }

    router.push("/admin/propiedades");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted">
            {property ? "Editar" : "Crear"}
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.03em]">
            {property ? "Editar propiedad" : "Nueva propiedad"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Los cambios se reflejan en el sitio apenas guardás.
          </p>
        </div>
        <Link href="/admin/propiedades" className="text-xs font-semibold text-muted hover:text-ink">
          Volver al listado
        </Link>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-accent/25 bg-accent/5 px-4 py-3 text-sm text-accent-dark">
          {error}
        </p>
      )}

      <div className="mt-7 space-y-5">
        <section className="rounded-2xl border border-line bg-cream p-5">
          <h2 className="text-lg tracking-tight">Información principal</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={inputLabel}>Título</span>
              <input
                name="title"
                defaultValue={property?.title}
                required
                minLength={5}
                maxLength={160}
                placeholder="Casa de 4 ambientes con jardín"
                className="field"
              />
            </label>
            <label className="block">
              <span className={inputLabel}>Slug (opcional)</span>
              <input
                name="slug"
                defaultValue={property?.slug}
                maxLength={160}
                placeholder="se genera del título"
                className="field"
              />
            </label>
            <label className="block">
              <span className={inputLabel}>Barrio</span>
              <input
                name="neighborhood"
                defaultValue={property?.neighborhood}
                required
                placeholder="El Palomar"
                className="field"
              />
            </label>
            <label className="block">
              <span className={inputLabel}>Operación</span>
              <select name="operation" defaultValue={property?.operation ?? "venta"} className="field">
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </label>
            <label className="block">
              <span className={inputLabel}>Tipo</span>
              <select name="type" defaultValue={property?.type ?? "casa"} className="field">
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="ph">PH</option>
                <option value="duplex">Dúplex</option>
                <option value="terreno">Terreno</option>
                <option value="local">Local</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className={inputLabel}>Dirección</span>
              <input
                name="address"
                defaultValue={property?.address ?? ""}
                placeholder="Los Cedros al 1200"
                className="field"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-5">
          <h2 className="text-lg tracking-tight">Precio</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className={inputLabel}>Precio</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={property?.price ?? ""}
                className="field"
              />
            </label>
            <label className="block">
              <span className={inputLabel}>Moneda</span>
              <select name="currency" defaultValue={property?.currency ?? "USD"} className="field">
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </label>
            <label className="block">
              <span className={inputLabel}>Expensas</span>
              <input
                name="expenses"
                type="number"
                min="0"
                step="0.01"
                defaultValue={property?.expenses ?? 0}
                className="field"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-5">
          <h2 className="text-lg tracking-tight">Detalles</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className={inputLabel}>Dormitorios</span>
              <input name="bedrooms" type="number" min="0" defaultValue={property?.bedrooms ?? 0} className="field" />
            </label>
            <label className="block">
              <span className={inputLabel}>Baños</span>
              <input name="bathrooms" type="number" min="0" defaultValue={property?.bathrooms ?? 0} className="field" />
            </label>
            <label className="block">
              <span className={inputLabel}>Cocheras</span>
              <input name="garages" type="number" min="0" defaultValue={property?.garages ?? 0} className="field" />
            </label>
            <label className="block">
              <span className={inputLabel}>M² cubiertos</span>
              <input name="area_m2" type="number" min="1" defaultValue={property?.area_m2 ?? ""} className="field" />
            </label>
            <label className="block">
              <span className={inputLabel}>M² de lote</span>
              <input name="lot_m2" type="number" min="1" defaultValue={property?.lot_m2 ?? ""} className="field" />
            </label>
            <label className="block">
              <span className={inputLabel}>Estado</span>
              <select name="status" defaultValue={property?.status ?? "disponible"} className="field">
                <option value="disponible">Disponible</option>
                <option value="reservada">Reservada</option>
                <option value="vendida">Vendida</option>
                <option value="alquilada">Alquilada</option>
              </select>
            </label>
          </div>

          <label className="mt-4 flex items-center gap-2.5 rounded-xl border border-line bg-paper px-3.5 py-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={property?.featured}
              className="size-4 accent-accent"
            />
            <span className="text-sm font-semibold">Mostrar en destacadas de la home</span>
          </label>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-5">
          <h2 className="text-lg tracking-tight">Descripción y comodidades</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className={inputLabel}>Descripción</span>
              <textarea
                name="description"
                rows={5}
                defaultValue={property?.description}
                placeholder="Contá qué hace especial a esta propiedad..."
                className="field resize-y"
              />
            </label>
            <label className="block">
              <span className={inputLabel}>Comodidades (separadas por coma)</span>
              <input
                name="amenities"
                defaultValue={property?.amenities.join(", ")}
                placeholder="Jardín, Parrilla, Cochera, Apto crédito"
                className="field"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-cream p-5">
          <h2 className="text-lg tracking-tight">Imágenes</h2>
          <p className="mt-1 text-xs text-muted">
            La primera imagen es la portada. Podés subir archivos o pegar una ruta interna.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <label className="btn btn-ghost cursor-pointer">
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {uploading ? "Subiendo..." : "Subir imágenes"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="sr-only"
                onChange={(event) => void uploadFiles(event.target.files)}
                disabled={uploading}
              />
            </label>
            <div className="flex min-w-56 flex-1 gap-2">
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="/images/foto-01.jpg"
                className="field"
              />
              <button type="button" onClick={addImageUrl} className="btn btn-ghost shrink-0 px-3">
                <ImagePlus size={15} />
              </button>
            </div>
          </div>

          {images.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-paper-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute left-1.5 top-1.5 rounded bg-ink/70 px-1.5 py-0.5 text-[0.6rem] font-bold text-cream">
                    {index === 0 ? "Portada" : index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setImages((current) => current.filter((_, position) => position !== index))}
                    className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-ink/70 text-cream opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Quitar imagen"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-muted">
              Todavía no hay imágenes.
            </p>
          )}
        </section>
      </div>

      <div className="sticky bottom-4 mt-6 flex items-center justify-end gap-2 rounded-2xl border border-line bg-cream/95 p-3 shadow-[0_20px_50px_-30px_rgba(21,26,22,.4)] backdrop-blur">
        <Link href="/admin/propiedades" className="btn btn-ghost">
          Cancelar
        </Link>
        <button type="submit" disabled={sending || uploading} className="btn btn-primary disabled:opacity-60">
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {sending ? "Guardando..." : "Guardar propiedad"}
        </button>
      </div>
    </form>
  );
}
