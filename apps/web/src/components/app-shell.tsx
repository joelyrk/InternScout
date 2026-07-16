import Link from "next/link";
import type { ReactNode } from "react";

import { Navigation } from "@/components/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="border-b border-stone-200 bg-[#eef1e9] lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-6 px-4 py-4 sm:px-6 lg:h-full lg:flex-col lg:items-stretch lg:px-6 lg:py-7">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 rounded-lg"
            aria-label="InternScout dashboard"
          >
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-xl bg-emerald-900 text-sm font-black tracking-[-0.08em] text-white shadow-sm transition group-hover:bg-emerald-800"
            >
              IS
            </span>
            <span className="text-lg font-black tracking-[-0.04em] text-stone-950">
              InternScout
            </span>
          </Link>

          <Navigation />

          <div className="mt-auto hidden rounded-2xl border border-emerald-900/10 bg-white/70 p-4 lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              Private by default
            </p>
            <p className="mt-2 text-sm leading-5 text-stone-600">
              Your resume and application details stay sensitive at every step.
            </p>
          </div>
        </div>
      </aside>

      <main id="main-content" tabIndex={-1} className="lg:pl-72">
        <div className="mx-auto min-h-screen max-w-screen-2xl px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
