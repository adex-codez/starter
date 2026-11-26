import { Dialog as KobalteDialog } from "@kobalte/core/dialog";
import { X } from "lucide-solid";
import { type ComponentProps, type ParentProps, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

export const Dialog = KobalteDialog;
export const DialogTrigger = KobalteDialog.Trigger;
export const DialogClose = KobalteDialog.CloseButton;

type DialogContentProps = ParentProps<{
  class?: string;
}>;

export function DialogContent(props: DialogContentProps) {
  return (
    <KobalteDialog.Portal>
      <KobalteDialog.Overlay class="fixed inset-0 z-50 bg-foreground/35 backdrop-blur-[2px] data-[expanded]:animate-in data-[expanded]:fade-in-0" />
      <KobalteDialog.Content
        class={cn(
          "fixed left-1/2 top-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl data-[expanded]:animate-in data-[expanded]:fade-in-0 data-[expanded]:zoom-in-95",
          props.class,
        )}
      >
        {props.children}
        <KobalteDialog.CloseButton
          aria-label="Close dialog"
          class="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <X class="size-4" />
        </KobalteDialog.CloseButton>
      </KobalteDialog.Content>
    </KobalteDialog.Portal>
  );
}

export function DialogHeader(props: ComponentProps<"div">) {
  const [local, others] = splitProps(props, ["class"]);

  return <div class={cn("flex flex-col gap-1.5 pr-8", local.class)} {...others} />;
}

export function DialogFooter(props: ComponentProps<"div">) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      class={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", local.class)}
      {...others}
    />
  );
}

export function DialogTitle(props: ParentProps<{ class?: string }>) {
  return (
    <KobalteDialog.Title
      class={cn("font-display text-xl font-semibold tracking-tight", props.class)}
    >
      {props.children}
    </KobalteDialog.Title>
  );
}

export function DialogDescription(props: ParentProps<{ class?: string }>) {
  return (
    <KobalteDialog.Description class={cn("text-sm text-muted-foreground", props.class)}>
      {props.children}
    </KobalteDialog.Description>
  );
}
