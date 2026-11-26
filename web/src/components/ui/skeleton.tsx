import { type ComponentProps, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type SkeletonProps = ComponentProps<"div">;

export function Skeleton(props: SkeletonProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <div class={cn("animate-pulse rounded-md bg-muted", local.class)} {...others} />;
}
