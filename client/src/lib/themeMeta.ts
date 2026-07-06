export const DARK_THEME_COLOR = "#0a1210";
export const LIGHT_THEME_COLOR = "#f8fafc";

export function applyThemeMeta(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";

  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.remove();
  });

  const meta = document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute("content", isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
  document.head.appendChild(meta);
}
