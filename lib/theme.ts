export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ecomms_theme";
const THEME_EVENT = "ecomms:theme-change";

/**
 * Runs before first paint (inlined in <head>) so the correct theme is applied
 * without a flash. A stored choice wins; otherwise the system preference is used.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})();`;

export function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function getServerTheme(): Theme {
  return "light";
}

export function setTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  root.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Preference simply won't persist.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
  window.setTimeout(() => root.classList.remove("theme-transition"), 300);
}

export function subscribeToTheme(callback: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  // Follow system changes only while the user hasn't chosen explicitly.
  const onSystemChange = () => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {}
    if (stored === "light" || stored === "dark") return;
    document.documentElement.classList.toggle("dark", media.matches);
    callback();
  };
  window.addEventListener(THEME_EVENT, callback);
  media.addEventListener("change", onSystemChange);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    media.removeEventListener("change", onSystemChange);
  };
}
