// src/theme.js
export const THEME_KEY = "echocache:theme";

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "system"; // "light" | "dark" | "system"
}

export function applyTheme(theme = getTheme()) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme"); // falls back to prefers-color-scheme
  } else {
    root.setAttribute("data-theme", theme); // force light or dark
  }
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === "light" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}
