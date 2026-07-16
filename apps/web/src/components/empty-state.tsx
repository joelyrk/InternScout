type EmptyStateProps = {
  icon: "search" | "briefcase" | "document" | "columns";
  title: string;
  description: string;
};

const iconPaths = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m15 15 4 4" />
    </>
  ),
  briefcase: (
    <>
      <path d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7" />
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M3 11.5c4.7 2 13.3 2 18 0M10 13h4" />
    </>
  ),
  document: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5M10 12h5M10 16h5" />
    </>
  ),
  columns: (
    <>
      <rect x="3" y="4" width="7" height="16" rx="2" />
      <rect x="14" y="4" width="7" height="16" rx="2" />
      <path d="M6 8h1M17 8h1" />
    </>
  ),
} as const;

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="grid min-h-72 place-items-center px-6 py-12 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
          >
            {iconPaths[icon]}
          </svg>
        </span>
        <h3 className="mt-5 text-lg font-bold text-stone-950">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
      </div>
    </div>
  );
}
