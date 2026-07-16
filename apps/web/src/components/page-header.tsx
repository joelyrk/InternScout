type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-stone-950 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">{description}</p>
    </header>
  );
}
