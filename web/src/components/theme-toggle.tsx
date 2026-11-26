import { Moon, Sun } from "lucide-solid";
import { createSignal, onMount, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { applyTheme, readTheme, type Theme } from "~/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = createSignal<Theme>("light");

  onMount(() => setTheme(readTheme()));

  const next = (): Theme => (theme() === "dark" ? "light" : "dark");

  const toggle = () => {
    const value = next();
    setTheme(value);
    applyTheme(value);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${next()} theme`}
      aria-pressed={theme() === "dark"}
      onClick={toggle}
    >
      <Show when={theme() === "dark"} fallback={<Moon />}>
        <Sun />
      </Show>
    </Button>
  );
}
