import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white p-8 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950">
        That page is off the map.
      </h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        The link may be outdated or the page may have moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900"
      >
        Return to dashboard
      </Link>
    </section>
  );
}
