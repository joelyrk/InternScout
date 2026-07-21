"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiClientError, getHealth, type HealthResponse } from "@/lib/api";

type BackendStatusProps = {
  apiBaseUrl: string | undefined;
};

type StatusState =
  | { kind: "loading" }
  | { kind: "available"; health: HealthResponse }
  | { kind: "unavailable"; message: string };

function errorMessage(error: unknown): string {
  return error instanceof ApiClientError
    ? error.message
    : "The backend status could not be checked safely.";
}

export function BackendStatus({ apiBaseUrl }: BackendStatusProps) {
  const [state, setState] = useState<StatusState>({ kind: "loading" });

  const checkHealth = useCallback(async () => {
    setState({ kind: "loading" });

    try {
      const health = await getHealth({ baseUrl: apiBaseUrl });
      setState({ kind: "available", health });
    } catch (error) {
      setState({ kind: "unavailable", message: errorMessage(error) });
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    let active = true;

    void getHealth({ baseUrl: apiBaseUrl }).then(
      (health) => {
        if (active) {
          setState({ kind: "available", health });
        }
      },
      (error: unknown) => {
        if (active) {
          setState({ kind: "unavailable", message: errorMessage(error) });
        }
      },
    );

    return () => {
      active = false;
    };
  }, [apiBaseUrl]);

  return (
    <div className="p-6" aria-live="polite">
      {state.kind === "loading" ? (
        <div role="status" className="flex items-center gap-3 text-sm font-semibold text-stone-600">
          <span aria-hidden="true" className="size-2.5 animate-pulse rounded-full bg-amber-500" />
          Checking backend connection…
        </div>
      ) : null}

      {state.kind === "available" ? (
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <p className="flex items-center gap-3 text-sm font-bold text-emerald-800">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-emerald-500" />
              Backend available
            </p>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-stone-500">Service</dt>
                <dd className="mt-1 font-bold text-stone-950">{state.health.service}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-500">Version</dt>
                <dd className="mt-1 font-bold text-stone-950">{state.health.version}</dd>
              </div>
            </dl>
          </div>
          <button
            type="button"
            onClick={() => void checkHealth()}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800"
          >
            Check again
          </button>
        </div>
      ) : null}

      {state.kind === "unavailable" ? (
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <p className="flex items-center gap-3 text-sm font-bold text-rose-800">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-rose-500" />
              Backend unavailable
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{state.message}</p>
          </div>
          <button
            type="button"
            onClick={() => void checkHealth()}
            className="rounded-lg bg-stone-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900"
          >
            Try again
          </button>
        </div>
      ) : null}
    </div>
  );
}
