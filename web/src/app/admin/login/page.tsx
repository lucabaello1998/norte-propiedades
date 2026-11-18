"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@nortepropiedades.com");
  const [password, setPassword] = useState("norte2026");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((response) => {
      if (response.ok) router.replace("/admin");
    });
  }, [router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "No pudimos iniciar sesión");
      setSending(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen bg-[#f4f3ef] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image src="/images/foto-03.jpg" alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <div className="absolute inset-x-10 bottom-10 text-cream">
          <Logo className="text-cream" />
          <p className="mt-6 max-w-md font-display text-3xl leading-tight tracking-[-0.02em]">
            El panel que hace que la web se sienta viva.
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/60">
            Cargá propiedades, respondé consultas y cambiá el estado de cada operación sin tocar una
            línea de código.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink">
            <ArrowLeft size={14} />
            Volver al sitio
          </Link>

          <h1 className="mt-8 font-display text-4xl tracking-[-0.03em]">Panel de gestión</h1>
          <p className="mt-2 text-sm text-muted">Ingresá para administrar propiedades y consultas.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field"
                autoComplete="username"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted">
                Contraseña
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field"
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <p className="rounded-xl border border-accent/25 bg-accent/5 px-3.5 py-2.5 text-xs text-accent-dark">
                {error}
              </p>
            )}

            <button type="submit" disabled={sending} className="btn btn-primary w-full disabled:opacity-60">
              {sending && <Loader2 size={16} className="animate-spin" />}
              {sending ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-line bg-cream p-4 text-xs leading-relaxed text-muted">
            <p className="font-bold text-ink">Acceso de demostración</p>
            <p className="mt-1">
              Email: <code className="text-ink">demo@nortepropiedades.com</code>
              <br />
              Contraseña: <code className="text-ink">norte2026</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
