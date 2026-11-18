import { ArrowUpRight, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import type { Property } from "@/lib/types";

export function MobileCta({ property }: { property: Property }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{formatPrice(property)}</p>
          <p className="truncate text-[0.68rem] text-muted">{property.neighborhood}</p>
        </div>
        <a
          href={whatsappLink(`Hola, me interesa ${property.title}.`)}
          target="_blank"
          rel="noreferrer"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-forest"
          aria-label={`Escribir por WhatsApp al ${site.phone}`}
        >
          <MessageCircle size={18} />
        </a>
        <a href="#consultar" className="btn btn-accent shrink-0">
          Consultar
          <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  );
}
