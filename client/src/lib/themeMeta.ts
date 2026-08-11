export const DARK_THEME_COLOR = "#0a1210";
export const LIGHT_THEME_COLOR = "#f8fafc";

export function applyThemeMeta(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";

  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]'
  );
  if (meta) {
    meta.setAttribute("content", isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
  } else {
    const created = document.createElement("meta");
    created.setAttribute("name", "theme-color");
    created.setAttribute("content", isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
    document.head.appendChild(created);
  }
}
