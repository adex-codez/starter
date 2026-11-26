export type HealthReport =
  | { readonly state: "ok"; readonly latencyMs: number }
  | { readonly state: "down"; readonly detail: string };

export function parseHealthReport(value: unknown): HealthReport | null {
  if (typeof value !== "object" || value === null || !("state" in value)) return null;
  if (value.state === "ok" && "latencyMs" in value && typeof value.latencyMs === "number") {
    return { state: "ok", latencyMs: Math.max(0, Math.round(value.latencyMs)) };
  }
  if (value.state === "down" && "detail" in value && typeof value.detail === "string") {
    return { state: "down", detail: value.detail };
  }
  return null;
}

export async function probeHealth(): Promise<HealthReport> {
  try {
    const response = await fetch("/api/health", { headers: { accept: "application/json" } });
    const payload: unknown = await response.json();
    return (
      parseHealthReport(payload) ?? {
        state: "down",
        detail: `The probe returned an unexpected payload (HTTP ${response.status})`,
      }
    );
  } catch (error) {
    return {
      state: "down",
      detail: error instanceof Error ? error.message : "The probe could not reach the app server",
    };
  }
}
