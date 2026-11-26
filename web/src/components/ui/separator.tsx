import { Separator as KobalteSeparator } from "@kobalte/core/separator";
import { cn } from "~/lib/utils";

type SeparatorProps = {
  class?: string;
  orientation?: "horizontal" | "vertical";
};

export function Separator(props: SeparatorProps) {
  return (
    <KobalteSeparator
      orientation={props.orientation}
      class={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        props.class,
      )}
    />
  );
}
