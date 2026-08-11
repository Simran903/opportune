import Link from "next/link";
import { Home, PlusSquare } from "lucide-react";
import { usePathname } from "next/navigation";
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

  return (
    <nav className={`${isCollapsed ? "px-2 pt-4 space-y-1" : "px-3 pt-4 space-y-1"}`}>
      {menuItems.map((item, index) => {
        const isActive = pathname === item.url;
        return (
          <div key={index} className="relative group">
            <Link
              href={item.url}
              className={`
                group flex items-center gap-3 h-9 rounded-[10px] text-sm font-medium
                relative overflow-hidden transition-all duration-200
                ${isCollapsed ? "justify-center px-0" : "px-3"}
                ${
                  isActive
                    ? "bg-accent-emerald/10 text-accent-emerald"
                    : "text-secondary-foreground hover:bg-surface-muted hover:text-foreground"
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald/40
              `}
              onClick={onNavigate}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[18px] w-[3px] rounded-full bg-gradient-to-b from-accent-emerald to-accent-teal" />
              )}

              <span className="w-5 flex justify-center flex-shrink-0">
                <item.icon
                  className={`
                    w-[18px] h-[18px] transition-colors duration-200
                    ${isActive ? "text-accent-emerald" : "text-secondary-foreground/70 group-hover:text-foreground"}
                  `}
                />
              </span>

              {!isCollapsed && (
                <span
                  className={`
                    flex-1 truncate transition-colors duration-200
                    ${isActive ? "text-accent-emerald" : "group-hover:text-foreground"}
                  `}
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