export type HealthResponse = {
  status: "ok";
  service: string;
  version: string;
};

export type ApiClientErrorCode =
  "CONFIGURATION_ERROR" | "TIMEOUT" | "NETWORK_ERROR" | "HTTP_ERROR" | "INVALID_RESPONSE";

export class ApiClientError extends Error {
  readonly code: ApiClientErrorCode;

  constructor(code: ApiClientErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ApiClientError";
    this.code = code;
  }
}

type GetHealthOptions = {
  baseUrl: string | undefined;
  timeoutMs?: number;
  fetchImplementation?: typeof fetch;
};

function healthEndpoint(baseUrl: string | undefined): string {
  if (!baseUrl) {
    throw new ApiClientError("CONFIGURATION_ERROR", "The backend connection is not configured.");
  }

  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch (error) {
    throw new ApiClientError(
      "CONFIGURATION_ERROR",
      "The backend connection is not configured correctly.",
      { cause: error },
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ApiClientError(
      "CONFIGURATION_ERROR",
      "The backend connection must use HTTP or HTTPS.",
    );
  }

  url.pathname = `${url.pathname.replace(/\/+$/, "")}/health`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

function isHealthResponse(value: unknown): value is HealthResponse {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    Object.keys(candidate).every((key) => ["status", "service", "version"].includes(key)) &&
    candidate.status === "ok" &&
    typeof candidate.service === "string" &&
    candidate.service.length > 0 &&
    typeof candidate.version === "string" &&
    candidate.version.length > 0
  );
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "name" in error && error.name === "AbortError"
  );
}

export async function getHealth({
  baseUrl,
  timeoutMs = 3_000,
  fetchImplementation = fetch,
}: GetHealthOptions): Promise<HealthResponse> {
  const endpoint = healthEndpoint(baseUrl);
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetchImplementation(endpoint, {
      cache: "no-store",
      credentials: "include",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted || isAbortError(error)) {
      throw new ApiClientError("TIMEOUT", "The backend did not respond in time.", {
        cause: error,
      });
    }

    throw new ApiClientError(
      "NETWORK_ERROR",
      "The backend could not be reached. Confirm that it is running.",
      { cause: error },
    );
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ApiClientError(
      "HTTP_ERROR",
      `The backend returned an unsuccessful response (${response.status}).`,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    throw new ApiClientError("INVALID_RESPONSE", "The backend returned an unexpected response.", {
      cause: error,
    });
  }

  if (!isHealthResponse(payload)) {
    throw new ApiClientError("INVALID_RESPONSE", "The backend returned an unexpected response.");
  }

  return payload;
}
