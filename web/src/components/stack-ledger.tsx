import { For } from "solid-js";

type StackRow = {
  readonly name: string;
  readonly role: string;
  readonly note: string;
  readonly version: string;
};

const rows: readonly StackRow[] = [
  {
    name: "SolidStart",
    role: "Routing and SSR",
    note: "file routes, API routes, streaming",
    version: "2.2.3",
  },
  {
    name: "Tailwind CSS",
    role: "Design tokens",
    note: "CSS-first theme, one class for dark mode",
    version: "4.3.5",
  },
  {
    name: "Kobalte",
    role: "Accessible primitives",
    note: "dialog, switch, separator",
    version: "0.13.14",
  },
  {
    name: "Go service",
    role: "API bridge",
    note: "proxied at /api/health",
    version: "1.26",
  },
];

export function StackLedger() {
  return (
    <ul>
      <For each={rows}>
        {(row) => (
          <li class="grid gap-1 border-t border-border/70 py-4 first:border-t-0 md:grid-cols-12 md:items-baseline md:gap-4">
            <span class="font-medium md:col-span-3">{row.name}</span>
            <span class="text-muted-foreground md:col-span-3">{row.role}</span>
            <span class="text-sm text-muted-foreground md:col-span-4">{row.note}</span>
            <span class="font-mono text-xs md:col-span-2 md:text-right">{row.version}</span>
          </li>
        )}
      </For>
    </ul>
  );
}
