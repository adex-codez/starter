import { A } from "@solidjs/router";
import { ArrowRight, Check } from "lucide-solid";
import { For } from "solid-js";
import { CommandLine } from "~/components/command-line";
import { HealthProbe } from "~/components/health-probe";
import { StackLedger } from "~/components/stack-ledger";
import { buttonVariants } from "~/components/ui/button";

const manifest = [
  "File routes with streaming SSR",
  "Tokens in CSS, one class for dark mode",
  "One API route proxies the Go service",
];

export default function Home() {
  return (
    <main class="mx-auto max-w-6xl px-5 sm:px-8">
      <section class="grid gap-10 border-b border-border/70 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <div class="lg:col-span-7">
          <p class="font-mono text-xs text-muted-foreground">
            SolidStart 2.2, Tailwind 4.3, Kobalte 0.13
          </p>
          <h1 class="mt-5 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-balance sm:text-6xl">
            Everything is wired.
            <br />
            Nothing is hidden.
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            This page is server-rendered, hydrated on the client, and talking to the Go service
            behind it. Open the bench, copy a primitive, delete what you do not need.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <A href="/bench" class={buttonVariants({ variant: "default" })}>
              Open the bench
              <ArrowRight />
            </A>
            <A href="#probe" class={buttonVariants({ variant: "outline" })}>
              Probe the API
            </A>
          </div>
          <ul class="mt-10 max-w-lg space-y-3 border-t border-border/70 pt-6">
            <For each={manifest}>
              {(item) => (
                <li class="flex items-start gap-2.5 text-sm">
                  <Check class="mt-0.5 size-4 shrink-0 text-signal" />
                  <span>{item}</span>
                </li>
              )}
            </For>
          </ul>
        </div>
        <div class="lg:col-span-5">
          <HealthProbe />
        </div>
      </section>

      <section class="grid gap-10 py-14 lg:grid-cols-12">
        <div class="lg:col-span-4">
          <h2 class="font-display text-3xl">What is in the box</h2>
          <p class="mt-3 text-muted-foreground">
            Four pieces carry the starter. Each one is replaceable without touching the others.
          </p>
        </div>
        <div class="lg:col-span-8">
          <StackLedger />
        </div>
      </section>

      <section class="pb-20">
        <div class="grid gap-8 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-2">
          <div>
            <h2 class="font-display text-2xl">Two commands</h2>
            <p class="mt-3 text-sm text-muted-foreground">
              Start the frontend and the API in separate terminals. The probe above needs both.
            </p>
            <p class="mt-4 text-xs text-muted-foreground">
              The Go service listens on :8080. Set API_BASE_URL to point elsewhere.
            </p>
          </div>
          <div>
            <CommandLine label="web" command="pnpm dev" />
            <div class="border-t border-border/70">
              <CommandLine label="api" command={".\\task.ps1 dev"} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
