import { type ComponentProps, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type LabelProps = ComponentProps<"label">;

export function Label(props: LabelProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <label class={cn("text-sm font-medium leading-none", local.class)} {...others} />;
}
