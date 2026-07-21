import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { BackendStatus } from "@/components/backend-status";
import { ApiClientError, getHealth } from "@/lib/api";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, getHealth: vi.fn() };
});

const mockedGetHealth = vi.mocked(getHealth);

describe("BackendStatus", () => {
  beforeEach(() => {
    mockedGetHealth.mockReset();
  });

  it("shows validated backend details when the service is available", async () => {
    mockedGetHealth.mockResolvedValue({
      status: "ok",
      service: "internscout-api",
      version: "0.1.0",
    });

    render(<BackendStatus apiBaseUrl="http://127.0.0.1:8000" />);

    expect(screen.getByRole("status")).toHaveTextContent("Checking backend connection");
    expect(await screen.findByText("Backend available")).toBeInTheDocument();
    expect(screen.getByText("internscout-api")).toBeInTheDocument();
    expect(screen.getByText("0.1.0")).toBeInTheDocument();
  });

  it("shows a readable error and allows another check", async () => {
    mockedGetHealth
      .mockRejectedValueOnce(
        new ApiClientError(
          "NETWORK_ERROR",
          "The backend could not be reached. Confirm that it is running.",
        ),
      )
      .mockResolvedValueOnce({
        status: "ok",
        service: "internscout-api",
        version: "0.1.0",
      });

    render(<BackendStatus apiBaseUrl="http://127.0.0.1:8000" />);

    expect(await screen.findByText("Backend unavailable")).toBeInTheDocument();
    expect(screen.getByText(/could not be reached/)).toBeInTheDocument();

    screen.getByRole("button", { name: "Try again" }).click();

    await waitFor(() => expect(mockedGetHealth).toHaveBeenCalledTimes(2));
    expect(await screen.findByText("Backend available")).toBeInTheDocument();
  });
});
