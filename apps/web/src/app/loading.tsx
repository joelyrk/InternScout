export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading page" className="animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-3 w-24 rounded-full bg-stone-200" />
        <div className="h-10 max-w-xl rounded-xl bg-stone-200" />
        <div className="h-5 max-w-2xl rounded-lg bg-stone-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-36 rounded-2xl border border-stone-200 bg-white" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
