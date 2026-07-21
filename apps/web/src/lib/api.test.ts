import { describe, expect, it, vi } from "vitest";

import { ApiClientError, getHealth } from "@/lib/api";

const baseUrl = "http://127.0.0.1:8000";

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

describe("getHealth", () => {
  it("returns a runtime-validated health response", async () => {
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse({
        status: "ok",
        service: "internscout-api",
        version: "0.1.0",
      }),
    );

    await expect(getHealth({ baseUrl, fetchImplementation })).resolves.toEqual({
      status: "ok",
      service: "internscout-api",
      version: "0.1.0",
    });
    expect(fetchImplementation).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/health",
      expect.objectContaining({
        cache: "no-store",
        credentials: "include",
        headers: { Accept: "application/json" },
      }),
    );
  });

  it("rejects an unconfigured API URL before making a request", async () => {
    const fetchImplementation = vi.fn<typeof fetch>();

    await expect(getHealth({ baseUrl: undefined, fetchImplementation })).rejects.toMatchObject({
      code: "CONFIGURATION_ERROR",
    });
    expect(fetchImplementation).not.toHaveBeenCalled();
  });

  it("rejects an unexpected response shape", async () => {
    const fetchImplementation = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ status: "ok", privateDetail: "not expected" }));

    await expect(getHealth({ baseUrl, fetchImplementation })).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });

  it("maps an unsuccessful status without exposing the response body", async () => {
    const fetchImplementation = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ diagnostic: "private" }, { status: 503 }));

    const request = getHealth({ baseUrl, fetchImplementation });

    await expect(request).rejects.toMatchObject({
      code: "HTTP_ERROR",
      message: "The backend returned an unsuccessful response (503).",
    });
    await expect(request).rejects.not.toThrow("private");
  });

  it("distinguishes timeouts from other network failures", async () => {
    const timeoutFetch = vi
      .fn<typeof fetch>()
      .mockRejectedValue(Object.assign(new Error("aborted"), { name: "AbortError" }));
    const networkFetch = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("fetch failed"));

    await expect(getHealth({ baseUrl, fetchImplementation: timeoutFetch })).rejects.toMatchObject({
      code: "TIMEOUT",
    });
    await expect(getHealth({ baseUrl, fetchImplementation: networkFetch })).rejects.toMatchObject({
      code: "NETWORK_ERROR",
    });
  });

  it("uses the stable API client error type", () => {
    const error = new ApiClientError("NETWORK_ERROR", "Synthetic safe message.");

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiClientError");
  });
});
