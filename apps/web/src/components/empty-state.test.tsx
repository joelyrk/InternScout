import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "@/components/empty-state";

describe("EmptyState", () => {
  it("provides a named heading and explanatory description", () => {
    render(
      <EmptyState
        icon="search"
        title="No opportunities yet"
        description="Save an opportunity when you are ready."
      />,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "No opportunities yet" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Save an opportunity when you are ready.")).toBeInTheDocument();
  });
});
