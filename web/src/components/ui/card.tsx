import { type ComponentProps, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type CardProps = ComponentProps<"div">;

export function Card(props: CardProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      class={cn("rounded-xl border border-border bg-card text-card-foreground", local.class)}
      {...others}
    />
  );
}

export function CardHeader(props: CardProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <div class={cn("flex flex-col gap-1.5 p-5", local.class)} {...others} />;
}

export function CardTitle(props: ComponentProps<"h3">) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <h3
      class={cn("font-display text-lg font-semibold leading-none tracking-tight", local.class)}
      {...others}
    />
  );
}

export function CardDescription(props: ComponentProps<"p">) {
  const [local, others] = splitProps(props, ["class"]);

  return <p class={cn("text-sm text-muted-foreground", local.class)} {...others} />;
}

export function CardContent(props: CardProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <div class={cn("p-5 pt-0", local.class)} {...others} />;
}

export function CardFooter(props: CardProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      class={cn("flex items-center gap-2 border-t border-border/70 px-5 py-3", local.class)}
      {...others}
    />
  );
}
