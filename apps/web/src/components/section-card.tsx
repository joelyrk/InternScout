import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(28,38,31,0.04)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stone-100 px-6 py-5">
        <h2 className="text-lg font-bold tracking-tight text-stone-950">{title}</h2>
        <p className="text-sm text-stone-500">{description}</p>
      </div>
      {children}
    </section>
  );
}
