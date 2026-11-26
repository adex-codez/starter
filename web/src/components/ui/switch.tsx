import { Switch as KobalteSwitch, type SwitchRootProps } from "@kobalte/core/switch";
import { type ParentProps, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

export const SwitchInput = KobalteSwitch.Input;

export function Switch(props: SwitchRootProps & { class?: string }) {
  const [local, others] = splitProps(props, ["class"]);

  return <KobalteSwitch class={cn("group/switch", local.class)} {...others} />;
}

type SwitchPartProps = ParentProps<{
  class?: string;
}>;

export function SwitchControl(props: SwitchPartProps) {
  return (
    <KobalteSwitch.Control
      class={cn(
        "inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-input p-0.5 transition-colors group-focus-within/switch:ring-2 group-focus-within/switch:ring-ring/60 group-focus-within/switch:ring-offset-2 group-focus-within/switch:ring-offset-background data-[checked]:bg-primary",
        props.class,
      )}
    >
      {props.children}
    </KobalteSwitch.Control>
  );
}

export function SwitchThumb(props: SwitchPartProps) {
  return (
    <KobalteSwitch.Thumb
      class={cn(
        "size-5 rounded-full bg-card shadow-sm transition-transform data-[checked]:translate-x-5",
        props.class,
      )}
    >
      {props.children}
    </KobalteSwitch.Thumb>
  );
}

export function SwitchLabel(props: SwitchPartProps) {
  return (
    <KobalteSwitch.Label class={cn("text-sm font-medium leading-none", props.class)}>
      {props.children}
    </KobalteSwitch.Label>
  );
}
