"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PropertyForm } from "@/components/admin/property-form";
import type { Property } from "@/lib/types";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/properties/${params.id}`)
      .then((response) => {
        if (response.status === 401) {
          router.replace("/admin/login");
          return null;
        }
        if (!response.ok) throw new Error("No encontrada");
        return response.json() as Promise<Property>;
      })
      .then((data) => {
        if (data) setProperty(data);
      })
      .catch(() => setError("No pudimos cargar la propiedad."));
  }, [params.id, router]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-accent/25 bg-accent/5 p-6 text-sm text-accent-dark">
        {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="grid h-64 place-items-center">
        <Loader2 size={22} className="animate-spin text-muted" />
      </div>
    );
  }

  return <PropertyForm property={property} />;
}
