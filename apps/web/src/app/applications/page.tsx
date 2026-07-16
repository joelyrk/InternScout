import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Pipeline"
        title="Applications"
        description="Track each opportunity from discovery to decision while keeping submission in your hands."
      />
      <SectionCard title="Application pipeline" description="0 active applications">
        <EmptyState
          icon="columns"
          title="Nothing in the pipeline"
          description="Application tracking arrives in Phase 3.2. InternScout will record your progress, never submit on your behalf."
        />
      </SectionCard>
    </div>
  );
}
