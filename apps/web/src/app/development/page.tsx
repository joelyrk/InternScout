import type { Metadata } from "next";

import { BackendStatus } from "@/components/backend-status";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

export const metadata: Metadata = { title: "Development" };

export default function DevelopmentPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="System"
        title="Development"
        description="Confirm that the local frontend can reach the InternScout API through the typed health contract."
      />
      <SectionCard title="Backend connection" description="A direct browser-to-API health check">
        <BackendStatus apiBaseUrl={process.env.NEXT_PUBLIC_INTERNSCOUT_API_URL} />
      </SectionCard>
    </div>
  );
}
