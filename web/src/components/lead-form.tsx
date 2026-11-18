"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";

type LeadFormProps = {
  propertyId?: number;
  propertyTitle?: string;
  compact?: boolean;
};

export function LeadForm({ propertyId, propertyTitle, compact = false }: LeadFormProps) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setState("sending");
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          propertyId: propertyId ?? null,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "No pudimos enviar la consulta. Probá de nuevo.");
        setState("error");
        return;
      }

      form.reset();
      setState("ok");
    } catch {
      setError("No pudimos enviar la consulta. Revisá tu conexión.");
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-forest/15 bg-forest/5 p-6 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-forest text-cream">
          <Check size={20} />
        </span>
        <p className="mt-4 font-display text-xl">Recibimos tu consulta</p>
        <p className="mt-1.5 text-sm text-muted">
          Te escribimos hoy mismo. Si es urgente, contactanos por WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-accent underline-offset-4 hover:underline"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2"}>
        <label className="block">
          <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted">
            Nombre
          </span>
          <input name="name" required minLength={2} maxLength={80} placeholder="Tu nombre" className="field" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted">
            Teléfono
          </span>
          <input
            name="phone"
            required
            minLength={6}
            maxLength={30}
            inputMode="tel"
            placeholder="11 5555 5555"
            className="field"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted">
          Email <span className="font-normal normal-case tracking-normal">(opcional)</span>
        </span>
        <input name="email" type="email" maxLength={120} placeholder="vos@email.com" className="field" />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-muted">
          Mensaje
        </span>
        <textarea
          name="message"
          rows={compact ? 3 : 4}
          maxLength={1000}
          defaultValue={
            propertyTitle
              ? `Hola, me interesa ${propertyTitle}. ¿Podemos coordinar una visita?`
              : "Hola, quiero hacer una consulta."
          }
          className="field resize-none"
        />
      </label>

      {state === "error" && (
        <p className="rounded-xl border border-accent/25 bg-accent/5 px-3.5 py-2.5 text-xs text-accent-dark">
          {error}
        </p>
      )}

      <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full disabled:opacity-60">
        {state === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
        {state === "sending" ? "Enviando..." : "Enviar consulta"}
      </button>

      <p className="text-center text-[0.68rem] leading-relaxed text-muted">
        Usamos tus datos solo para responderte. Sin spam.
      </p>
    </form>
  );
}
