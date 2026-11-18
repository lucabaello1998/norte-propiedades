import Link from "next/link";
import { ArrowUpRight, AtSign, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { site, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer id="contacto" className="bg-forest text-cream">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo className="text-cream" />
            <p className="mt-6 text-sm leading-relaxed text-cream/70">
              Compra, venta y alquiler de propiedades en zona oeste. Fotos reales, datos claros y
              una persona del otro lado que te responde.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-cream"
            >
              <AtSign size={16} />
              @nortepropiedades
            </a>
          </div>

          <div>
            <p className="eyebrow text-cream/70">Explorar</p>
            <nav className="mt-4 flex flex-col gap-2.5 text-sm text-cream/80">
              <Link href="/propiedades" className="transition-colors hover:text-cream">
                Todas las propiedades
              </Link>
              <Link href="/propiedades?operation=venta" className="transition-colors hover:text-cream">
                En venta
              </Link>
              <Link href="/propiedades?operation=alquiler" className="transition-colors hover:text-cream">
                En alquiler
              </Link>
              <Link href="/#barrios" className="transition-colors hover:text-cream">
                Barrios
              </Link>
            </nav>
          </div>

          <div>
            <p className="eyebrow text-cream/70">Contacto</p>
            <div className="mt-4 space-y-3 text-sm text-cream/80">
              <a href={site.phoneHref} className="flex items-start gap-2.5 transition-colors hover:text-cream">
                <Phone size={16} className="mt-0.5 shrink-0" />
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-start gap-2.5 transition-colors hover:text-cream">
                <Mail size={16} className="mt-0.5 shrink-0" />
                {site.email}
              </a>
              <p className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                {site.address}
              </p>
              <p className="text-xs leading-relaxed text-cream/70">{site.hours}</p>
            </div>
            <a
              href={whatsappLink("Hola, quiero hacer una consulta.")}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cream"
            >
              Escribir por WhatsApp
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-cream/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Norte Propiedades. Todos los derechos reservados.</p>
          <p>Sitio de demostración · Propiedades y datos ficticios</p>
        </div>
      </div>
    </footer>
  );
}
