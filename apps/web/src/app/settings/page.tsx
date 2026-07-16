import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Settings" };

const settings = [
  {
    title: "Candidate profile",
    description: "Degree, skills, role interests, availability, and work authorization.",
    milestone: "Milestone 1",
  },
  {
    title: "Match preferences",
    description: "Locations, role types, company exclusions, and transparent score controls.",
    milestone: "Milestone 4",
  },
  {
    title: "Notifications",
    description: "Thresholds, digest timing, channels, and quiet hours.",
    milestone: "Milestone 7",
  },
] as const;

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your controls"
        title="Settings"
        description="InternScout will put privacy, matching, and notification choices in one place."
      />
      <section aria-labelledby="settings-heading">
        <h2 id="settings-heading" className="sr-only">
          Available settings areas
        </h2>
        <div className="divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {settings.map((setting) => (
            <article
              key={setting.title}
              className="grid gap-3 p-6 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <h3 className="font-bold text-stone-950">{setting.title}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-500">
                  {setting.description}
                </p>
              </div>
              <span className="w-fit rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-600">
                {setting.milestone}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
