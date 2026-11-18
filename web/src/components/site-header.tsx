"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { site, whatsappLink } from "@/lib/site";

const links = [
  { href: "/propiedades", label: "Propiedades" },
  { href: "/#barrios", label: "Barrios" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overlay = pathname === "/" && !scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          overlay
            ? "bg-transparent text-cream"
            : "border-b border-line/80 bg-paper/90 text-ink shadow-[0_10px_40px_-30px_rgba(21,26,22,.45)] backdrop-blur-xl"
        }`}
      >
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-[0.82rem] font-semibold tracking-wide"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={site.phoneHref}
              className="flex items-center gap-2 text-[0.82rem] font-semibold"
            >
              <Phone size={14} />
              {site.phone}
            </a>
            <a
              href={whatsappLink("Hola, quiero hacer una consulta.")}
              target="_blank"
              rel="noreferrer"
              className={`btn ${overlay ? "bg-cream text-ink hover:bg-paper-3" : "btn-primary"}`}
            >
              Hablemos
              <ArrowUpRight size={15} />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-full border border-current/20 lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="menu-in fixed inset-0 top-20 z-40 flex flex-col bg-paper text-ink lg:hidden">
          <nav className="container-page flex flex-1 flex-col justify-center gap-2 py-10">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-baseline justify-between border-b border-line py-4"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                <span className="font-display text-4xl tracking-tight">{link.label}</span>
                <ArrowUpRight
                  size={20}
                  className="text-muted transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </nav>
          <div className="container-page space-y-3 pb-10 text-sm">
            <a href={site.phoneHref} className="flex items-center gap-2 font-semibold">
              <Phone size={15} /> {site.phone}
            </a>
            <a
              href={whatsappLink("Hola, quiero hacer una consulta.")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-accent w-full"
            >
              Escribir por WhatsApp
              <ArrowUpRight size={15} />
            </a>
            <p className="text-xs text-muted">{site.hours}</p>
          </div>
        </div>
      )}
    </>
  );
}
