import { Check, Copy } from "lucide-solid";
import { createSignal, onCleanup, Show } from "solid-js";
import { Button } from "~/components/ui/button";

type CommandLineProps = {
  label: string;
  command: string;
};

export function CommandLine(props: CommandLineProps) {
  const [copied, setCopied] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (timer !== undefined) clearTimeout(timer);
  });

  const showCopied = () => {
    setCopied(true);
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => setCopied(false), 1600);
  };

  const copy = () => {
    if (!navigator.clipboard) return;
    void navigator.clipboard.writeText(props.command).then(showCopied, () => undefined);
  };

  return (
    <div class="flex items-center gap-4 py-3">
      <span class="w-10 shrink-0 font-mono text-xs text-muted-foreground">{props.label}</span>
      <code class="min-w-0 flex-1 truncate font-mono text-sm">{props.command}</code>
      <Button
        variant="ghost"
        size="icon"
        class="size-8 shrink-0"
        aria-label={`Copy ${props.label} command`}
        onClick={copy}
      >
        <Show when={copied()} fallback={<Copy />}>
          <Check />
        </Show>
      </Button>
    </div>
  );
}
