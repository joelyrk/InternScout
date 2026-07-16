import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified story"
        title="Resume"
        description="Shape job-specific versions without changing the facts behind your work."
      />
      <SectionCard title="Master resume" description="No resume has been created">
        <EmptyState
          icon="document"
          title="Start with evidence, not a blank page"
          description="The verified evidence store and master resume arrive in Milestone 2. Generated claims will require evidence and your approval."
        />
      </SectionCard>
    </div>
  );
}
