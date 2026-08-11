import Link from "next/link";
import { Home, PlusSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { SidebarTooltip } from "./SidebarTooltip";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Post Job", icon: PlusSquare, url: "/post-job" },
];

type SidebarNavigationProps = {
  isCollapsed: boolean;
  onNavigate: () => void;
};

export const SidebarNavigation = ({
  isCollapsed,
  onNavigate,
}: SidebarNavigationProps) => {
  const pathname = usePathname();
  const { getThemeClasses } = useTheme();

  return (
    <nav className={`py-4 ${isCollapsed ? "px-2 space-y-1.5" : "px-4 space-y-1.5"}`}>
      {!isCollapsed && (
        <p
          className={`px-3 pb-3 text-[10px] font-medium uppercase tracking-[0.16em] ${getThemeClasses.text.muted}`}
        >
          Menu
        </p>
      )}
      {menuItems.map((item, index) => {
        const isActive = pathname === item.url;
        return (
          <div key={index} className="relative group">
            <Link
              href={item.url}
              className={`
                flex items-center rounded-xl font-medium relative overflow-hidden
                ${isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-2.5"}
                ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-500 dark:text-emerald-300 border border-emerald-500/30 shadow-soft"
                    : `${getThemeClasses.button.ghost} border border-transparent hover:translate-x-0.5`
                }
                transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
              `}
              onClick={onNavigate}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-gradient-to-b from-emerald-400 to-teal-400" />
              )}

              <div className="relative flex-shrink-0">
                <item.icon
                  className={`w-5 h-5 ${
                    isActive
                      ? "text-emerald-400"
                      : getThemeClasses.accent.emerald
                  } transition-colors duration-200`}
                />
              </div>

              {!isCollapsed && (
                <span
                  className={`${
                    isActive
                      ? "text-emerald-400 font-medium"
                      : getThemeClasses.text.secondary
                  } group-hover:text-emerald-400 transition-colors duration-200 flex-1 truncate`}
                >
                  {item.title}
                </span>
              )}
            </Link>

            {isCollapsed && <SidebarTooltip>{item.title}</SidebarTooltip>}
          </div>
        );
      })}
    </nav>
  );
};