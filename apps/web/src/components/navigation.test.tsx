import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Navigation, navigationItems } from "@/components/navigation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/jobs",
}));

describe("Navigation", () => {
  it("exposes every primary route and marks the current page", () => {
    render(<Navigation />);

    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(navigationItems.length);
    expect(screen.getByRole("link", { name: "Jobs" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current");
  });
});
