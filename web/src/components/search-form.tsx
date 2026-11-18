import { Search } from "lucide-react";
import type { Operation, PropertyType } from "@/lib/types";

type Defaults = {
  operation?: string;
  type?: string;
  neighborhood?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
};

type SearchFormProps = {
  neighborhoods: string[];
  defaults?: Defaults;
  variant?: "hero" | "page";
};

const types: { value: PropertyType | ""; label: string }[] = [
  { value: "", label: "Tipo de propiedad" },
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "ph", label: "PH" },
  { value: "duplex", label: "Dúplex" },
  { value: "terreno", label: "Terreno" },
  { value: "local", label: "Local" },
];

const operations: { value: Operation | ""; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "venta", label: "Venta" },
  { value: "alquiler", label: "Alquiler" },
];

export function SearchForm({ neighborhoods, defaults = {}, variant = "hero" }: SearchFormProps) {
  const isPage = variant === "page";

  return (
    <form
      action="/propiedades"
      method="get"
      className={
        isPage
          ? "card-surface p-4 sm:p-5"
          : "rounded-[1.35rem] border border-line/70 bg-cream p-4 shadow-[0_30px_80px_-40px_rgba(21,26,22,.55)] sm:p-5"
      }
    >
      <fieldset>
        <legend className="sr-only">Operación</legend>
        <div className="flex flex-wrap items-center gap-2">
          {operations
            .filter((operation) => isPage || operation.value !== "")
            .map((operation) => (
              <label key={operation.value || "todas"} className="cursor-pointer">
                <input
                  type="radio"
                  name="operation"
                  value={operation.value}
                  defaultChecked={
                    operation.value === (defaults.operation ?? (isPage ? "" : "venta"))
                  }
                  className="peer sr-only"
                />
                <span className="inline-flex rounded-full border border-line bg-paper px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-muted transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream">
                  {operation.label}
                </span>
              </label>
            ))}
          {isPage && (
            <label className="ml-auto flex min-w-52 flex-1 items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 sm:max-w-xs">
              <Search size={14} className="shrink-0 text-muted" />
              <input
                type="search"
                name="q"
                defaultValue={defaults.q}
                placeholder="Barrio, calle o palabra clave"
                className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-muted"
                aria-label="Buscar propiedades"
              />
            </label>
          )}
        </div>
      </fieldset>

      <div className={`mt-3 grid gap-3 ${isPage ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-[1fr_1fr_auto]"}`}>
        <label className="sr-only" htmlFor="search-type">
          Tipo
        </label>
        <select id="search-type" name="type" defaultValue={defaults.type ?? ""} className="field">
          {types.map((type) => (
            <option key={type.value || "todos"} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="search-neighborhood">
          Barrio
        </label>
        <select
          id="search-neighborhood"
          name="neighborhood"
          defaultValue={defaults.neighborhood ?? ""}
          className="field"
        >
          <option value="">Todos los barrios</option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>

        {isPage && (
          <>
            <label className="sr-only" htmlFor="search-min">
              Precio mínimo
            </label>
            <input
              id="search-min"
              type="number"
              name="minPrice"
              min="0"
              defaultValue={defaults.minPrice}
              placeholder="Precio mínimo"
              className="field"
            />
            <label className="sr-only" htmlFor="search-max">
              Precio máximo
            </label>
            <input
              id="search-max"
              type="number"
              name="maxPrice"
              min="0"
              defaultValue={defaults.maxPrice}
              placeholder="Precio máximo"
              className="field"
            />
          </>
        )}

        <button type="submit" className="btn btn-accent w-full sm:w-auto">
          <Search size={15} />
          Buscar
        </button>
      </div>

      {isPage && (
        <div className="mt-3 flex justify-end">
          <a href="/propiedades" className="text-xs font-semibold text-muted underline-offset-4 hover:underline">
            Limpiar filtros
          </a>
        </div>
      )}
    </form>
  );
}
