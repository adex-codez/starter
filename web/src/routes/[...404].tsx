import { A } from "@solidjs/router";
import { HttpStatusCode } from "@solidjs/start";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function NotFound() {
  return (
    <main class="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-start justify-center px-5 py-20 sm:px-8">
      <HttpStatusCode code={404} />
      <p class="font-mono text-xs text-muted-foreground">404</p>
      <h1 class="mt-3 font-display text-4xl">This route never sprouted.</h1>
      <p class="mt-3 text-muted-foreground">The page you asked for is not in the route tree.</p>
      <A href="/" class={cn(buttonVariants({ variant: "default" }), "mt-8")}>
        Back to the overview
      </A>
    </main>
  );
}
