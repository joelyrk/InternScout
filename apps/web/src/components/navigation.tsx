"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navigationItems = [
  { label: "Dashboard", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Resume", href: "/resume" },
  { label: "Applications", href: "/applications" },
  { label: "Settings", href: "/settings" },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="min-w-0 flex-1 overflow-x-auto lg:mt-9 lg:overflow-visible"
    >
      <ul className="flex min-w-max gap-1 lg:min-w-0 lg:flex-col">
        {navigationItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-white text-emerald-900 shadow-[0_1px_2px_rgba(28,38,31,0.08)]"
                    : "text-stone-600 hover:bg-white/60 hover:text-stone-950"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
