export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="15" cy="15" r="14" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
        <path
          d="M15 4.5 23.5 25.5 15 21.2 6.5 25.5 15 4.5Z"
          fill="currentColor"
          opacity="0.12"
        />
        <path d="M15 4.5 15 21.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M15 21.2 23.5 25.5 15 4.5 6.5 25.5 15 21.2Z" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="15" cy="15" r="1.6" fill="#b4552d" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[1.35rem] tracking-[-0.03em]">Norte</span>
        <span className="mt-0.5 block text-[0.55rem] font-semibold uppercase tracking-[0.32em] opacity-70">
          Propiedades
        </span>
      </span>
    </span>
  );
}
