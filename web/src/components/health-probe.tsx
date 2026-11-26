import { RefreshCw } from "lucide-solid";
import { createResource, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import { probeHealth, type HealthReport } from "~/lib/api";
import { cn } from "~/lib/utils";

type ProbeStatus = "ok" | "down" | "waiting";

const presentation: Record<ProbeStatus, { label: string; dot: string }> = {
  ok: { label: "Connected", dot: "bg-signal" },
  down: { label: "Offline", dot: "bg-destructive" },
  waiting: { label: "Waiting", dot: "bg-muted-foreground" },
};

export function HealthProbe() {
  const [report, { refetch }] = createResource<HealthReport | null>(() =>
    typeof window === "undefined" ? Promise.resolve(null) : probeHealth(),
  );

  onMount(() => {
    if (!report.loading && report() === null) void refetch();
  });

  const status = (): ProbeStatus => {
    const value = report();
    return value == null ? "waiting" : value.state;
  };

  const detail = (): string => {
    const value = report();
    if (value == null) return "Contacting the app server.";
    return value.state === "ok" ? `${value.latencyMs} ms round trip` : value.detail;
  };

  return (
    <section id="probe" class="scroll-mt-24 rounded-xl border border-border bg-card p-5">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-sm font-medium">API probe</h2>
        <span
          class={cn("size-2 rounded-full", presentation[status()].dot)}
          aria-hidden="true"
        />
      </div>
      <p class="mt-4 font-display text-2xl leading-none">{presentation[status()].label}</p>
      <p class="mt-2 text-xs text-muted-foreground">{detail()}</p>
      <div class="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
        <code class="font-mono text-xs text-muted-foreground">GET /api/health</code>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          <RefreshCw class={cn(report.loading && "animate-spin")} />
          Probe again
        </Button>
      </div>
    </section>
  );
}
