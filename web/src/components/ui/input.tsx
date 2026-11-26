import { type ComponentProps, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type InputProps = ComponentProps<"input">;

export function Input(props: InputProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <input
      class={cn(
        "h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50 aria-invalid:border-destructive",
        local.class,
      )}
      {...others}
    />
  );
}
