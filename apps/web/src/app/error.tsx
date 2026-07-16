"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Full error details stay client-side until privacy-safe telemetry is introduced.
    void error.digest;
  }, [error]);

  return (
    <section
      className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-8 text-center"
      role="alert"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-700">
        Something went wrong
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950">
        This page could not load.
      </h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        Your information has not been changed. Try loading this view again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900"
      >
        Try again
      </button>
    </section>
  );
}
