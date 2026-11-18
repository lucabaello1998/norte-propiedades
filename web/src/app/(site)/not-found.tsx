import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[70svh] place-items-center py-32">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 font-display text-5xl tracking-[-0.03em]">Esta puerta no existe</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          La página que buscás se mudó, se vendió o nunca estuvo acá. Volvé al listado y seguimos
          buscando juntos.
        </p>
        <Link href="/propiedades" className="btn btn-primary mt-7">
          <ArrowLeft size={15} />
          Ver propiedades
        </Link>
      </div>
    </div>
  );
}
