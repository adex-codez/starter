export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "skill-sprout-theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function readTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage is blocked in some embedded and private browsing contexts.
  }
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The class still applies for this session when storage is blocked.
  }
}

export const themeBootstrapScript = `(function(){try{var k="${THEME_STORAGE_KEY}",s=localStorage.getItem(k);if(s!=="light"&&s!=="dark"){s=window.matchMedia("${DARK_QUERY}").matches?"dark":"light"}if(s==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;
