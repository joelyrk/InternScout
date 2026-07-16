import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

export const metadata: Metadata = { title: "Jobs" };

export default function JobsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Opportunities"
        title="Jobs"
        description="Keep promising internships together, with their requirements and deadlines close at hand."
      />
      <SectionCard title="Saved jobs" description="0 opportunities in your workspace">
        <EmptyState
          icon="briefcase"
          title="Your job list is empty"
          description="Manual job entry will be added in Phase 3.1. No external site will be scraped or submitted to automatically."
        />
      </SectionCard>
    </div>
  );
}
