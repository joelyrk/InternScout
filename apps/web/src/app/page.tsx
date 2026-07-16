import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

const stats = [
  { label: "Saved roles", value: "0", detail: "Ready when you find one" },
  { label: "Strong matches", value: "0", detail: "Scores will stay explainable" },
  { label: "Applications", value: "0", detail: "Nothing submitted automatically" },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Your internship search, in one calm place."
        description="Build a verified profile, compare opportunities, and stay in control of every application."
      />

      <section aria-labelledby="progress-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              At a glance
            </p>
            <h2
              id="progress-heading"
              className="mt-1 text-xl font-bold tracking-tight text-stone-950"
            >
              Search progress
            </h2>
          </div>
          <p className="text-sm text-stone-500">Starting from a clean slate</p>
        </div>
        <dl className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(28,38,31,0.04)]"
            >
              <dt className="text-sm font-semibold text-stone-600">{stat.label}</dt>
              <dd className="mt-5 text-4xl font-bold tracking-[-0.05em] text-stone-950">
                {stat.value}
              </dd>
              <dd className="mt-2 text-sm leading-6 text-stone-500">{stat.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <SectionCard title="Recent opportunities" description="Roles you save will appear here.">
          <EmptyState
            icon="search"
            title="No opportunities yet"
            description="Manual job entry arrives in Phase 3. Your workspace is ready for it."
          />
        </SectionCard>

        <aside className="rounded-2xl bg-emerald-950 p-6 text-emerald-50 shadow-[0_18px_50px_rgba(13,63,43,0.16)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            Built-in guardrail
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">Evidence before eloquence.</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-100/80">
            InternScout will never invent your experience. Resume suggestions must trace back to
            facts you verify.
          </p>
          <div className="mt-8 border-t border-emerald-800 pt-5 text-sm font-semibold text-emerald-200">
            You approve every application step.
          </div>
        </aside>
      </div>
    </div>
  );
}
