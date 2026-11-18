"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";

const nav = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/admin/consultas", label: "Consultas", icon: MessageSquare },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok">("loading");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((response) => {
        if (cancelled) return;
        if (response.status === 401) {
          router.replace("/admin/login");
          return;
        }
        if (!response.ok) throw new Error("No autorizado");
        setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) router.replace("/admin/login");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f3ef]">
        <Loader2 size={22} className="animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f3ef] text-ink lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden flex-col bg-forest p-5 text-cream lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Link href="/admin" className="px-2 py-2">
          <Logo className="text-cream" />
        </Link>
        <p className="mt-6 px-2 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-cream/40">
          Panel de gestión
        </p>
        <nav className="mt-3 flex flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "bg-cream/12 text-cream" : "text-cream/65 hover:bg-cream/8 hover:text-cream"
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 border-t border-cream/12 pt-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-cream/65 transition-colors hover:bg-cream/8 hover:text-cream"
          >
            <ExternalLink size={16} />
            Ver el sitio
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-cream/65 transition-colors hover:bg-cream/8 hover:text-cream"
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-[#f4f3ef]/90 px-4 backdrop-blur-xl lg:hidden">
          <Link href="/admin">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-full border border-line"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        {open && (
          <div className="menu-in fixed inset-x-0 top-16 z-20 border-b border-line bg-cream p-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-paper-2"
                >
                  <item.icon size={17} />
                  {item.label}
                </Link>
              ))}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-paper-2"
              >
                <ExternalLink size={17} />
                Ver el sitio
              </a>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-left text-sm font-semibold text-accent hover:bg-paper-2"
              >
                <LogOut size={17} />
                Salir
              </button>
            </nav>
          </div>
        )}

        <main className="min-w-0 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
