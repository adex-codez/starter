import type { APIEvent } from "@solidjs/start/server";
import type { HealthReport } from "~/lib/api";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:8080";
const PROBE_TIMEOUT_MS = 2_500;

function isGoHealthPayload(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  if (!("success" in value) || value.success !== true) return false;
  if (!("data" in value) || typeof value.data !== "object" || value.data === null) return false;
  return "status" in value.data && value.data.status === "ok";
}

function report(body: HealthReport, status: number): Response {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

export async function GET(_event: APIEvent): Promise<Response> {
  const startedAt = performance.now();
  try {
    const response = await fetch(new URL("/health", API_BASE_URL), {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    if (!response.ok) {
      return report({ state: "down", detail: `The Go service answered HTTP ${response.status}` }, 502);
    }
    const payload: unknown = await response.json();
    if (!isGoHealthPayload(payload)) {
      return report({ state: "down", detail: "The Go service returned an unexpected health payload" }, 502);
    }
    return report({ state: "ok", latencyMs: Math.round(performance.now() - startedAt) }, 200);
  } catch (error) {
    const detail =
      error instanceof Error && error.name === "TimeoutError"
        ? `No answer from ${API_BASE_URL} within ${PROBE_TIMEOUT_MS}ms`
        : `Could not reach ${API_BASE_URL}`;
    return report({ state: "down", detail }, 502);
  }
}
