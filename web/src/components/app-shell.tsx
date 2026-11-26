import { A } from "@solidjs/router";
import { ArrowUpRight, Sprout } from "lucide-solid";
import { type ParentProps } from "solid-js";
import { ThemeToggle } from "~/components/theme-toggle";
import { buttonVariants } from "~/components/ui/button";

const navLink =
  "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground";

export function AppShell(props: ParentProps) {
  return (
    <div class="flex min-h-screen flex-col">
      <header class="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 sm:px-8">
          <A href="/" class="flex items-center gap-2">
            <Sprout class="size-5 text-primary" />
            <span class="font-display text-[15px] font-semibold tracking-tight">skill sprout</span>
            <span class="font-mono text-[10px] text-muted-foreground">v2</span>
          </A>
          <nav class="hidden items-center gap-1 sm:flex">
            <A href="/" end class={navLink} activeClass="bg-accent text-accent-foreground">
              Overview
            </A>
            <A href="/bench" class={navLink} activeClass="bg-accent text-accent-foreground">
              Bench
            </A>
          </nav>
          <div class="ml-auto flex items-center gap-2">
            <a
              href="https://github.com/adex-codez/starter"
              target="_blank"
              rel="noopener noreferrer"
              class={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Repository
              <ArrowUpRight />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div class="flex-1">{props.children}</div>
      <footer class="border-t border-border/70">
        <div class="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
          <p>SolidStart 2, Tailwind 4, Kobalte. The Go service lives in server/.</p>
          <p class="font-mono">web/src/routes</p>
        </div>
      </footer>
    </div>
  );
}
