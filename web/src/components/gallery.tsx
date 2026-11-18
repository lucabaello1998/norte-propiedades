"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const count = images.length;

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") setIndex((value) => (value === null ? null : (value + 1) % count));
      if (event.key === "ArrowLeft") setIndex((value) => (value === null ? null : (value - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, count]);

  if (count === 0) {
    return <div className="aspect-[16/9] rounded-[1.25rem] bg-paper-3" />;
  }

  return (
    <>
      <div className="flex snap-x-mandatory gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-[2fr_1fr] lg:grid-rows-2 lg:gap-3 lg:overflow-visible lg:pb-0">
        {images.map((image, position) => (
          <button
            key={`${image}-${position}`}
            type="button"
            onClick={() => setIndex(position)}
            className={`zoom-media group relative shrink-0 snap-start overflow-hidden rounded-xl bg-paper-3 lg:rounded-[1.1rem] ${
              position === 0
                ? "aspect-[4/3] w-[86%] lg:col-start-1 lg:row-span-2 lg:aspect-auto lg:h-[520px] lg:w-auto"
                : "aspect-[4/3] w-[86%] lg:col-start-2 lg:aspect-auto lg:h-[254px] lg:w-auto"
            } ${position > 2 ? "lg:hidden" : ""}`}
            aria-label={`Ver foto ${position + 1} de ${count}`}
          >
            <Image
              src={image}
              alt={`${title} — foto ${position + 1}`}
              fill
              priority={position === 0}
              sizes={position === 0 ? "(max-width: 1024px) 86vw, 66vw" : "(max-width: 1024px) 86vw, 33vw"}
              className="object-cover"
            />
            {position === 0 && (
              <span className="absolute bottom-3 right-3 hidden items-center gap-2 rounded-full bg-cream/95 px-4 py-2 text-xs font-bold text-ink backdrop-blur transition-transform group-hover:-translate-y-0.5 lg:inline-flex">
                <Expand size={14} />
                Ver las {count} fotos
              </span>
            )}
          </button>
        ))}
      </div>

      {index !== null && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-ink/96 text-cream"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos de ${title}`}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/60">
              {index + 1} / {count}
            </p>
            <button
              type="button"
              onClick={() => setIndex(null)}
              className="grid size-10 place-items-center rounded-full border border-cream/20 transition-colors hover:bg-cream/10"
              aria-label="Cerrar galería"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-3 pb-3 sm:px-8">
            <button
              type="button"
              onClick={() => setIndex((value) => (value === null ? null : (value - 1 + count) % count))}
              className="absolute left-3 z-10 grid size-11 place-items-center rounded-full bg-ink/60 backdrop-blur transition-colors hover:bg-ink sm:left-6"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="relative h-full max-h-[78vh] w-full max-w-6xl">
              <Image
                src={images[index]}
                alt={`${title} — foto ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => setIndex((value) => (value === null ? null : (value + 1) % count))}
              className="absolute right-3 z-10 grid size-11 place-items-center rounded-full bg-ink/60 backdrop-blur transition-colors hover:bg-ink sm:right-6"
              aria-label="Foto siguiente"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-5 sm:justify-center sm:px-8">
            {images.map((image, position) => (
              <button
                key={`thumb-${image}-${position}`}
                type="button"
                onClick={() => setIndex(position)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity ${
                  position === index ? "border-accent opacity-100" : "border-transparent opacity-55 hover:opacity-90"
                }`}
                aria-label={`Ir a la foto ${position + 1}`}
              >
                <Image src={image} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
