import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type SidebarHeaderProps = {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export const SidebarHeader = ({
  isCollapsed,
  onToggleCollapse,
}: SidebarHeaderProps) => {
  const { getThemeClasses } = useTheme();

  return (
    <div
      className={`relative flex items-center h-14 border-b border-border/70 transition-colors duration-200 ${isCollapsed ? "justify-center px-2" : "justify-between px-5"
        }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-display font-bold text-sm">O</span>
        </div>
        {!isCollapsed && (
          <span className={`font-display font-semibold text-[16px] tracking-tight truncate ${getThemeClasses.text.primary}`}>
            Opportune
          </span>
        )}
      </div>

      {/* Collapse button - only show on desktop */}
      <button
        onClick={onToggleCollapse}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`
          hidden md:flex items-center justify-center
          w-7 h-7 rounded-lg
          transition-all duration-200 hover:bg-surface-muted
          ${getThemeClasses.text.secondary} hover:text-foreground
          ${isCollapsed ? "absolute -right-2.5 top-1/2 transform -translate-y-1/2 z-10" : ""}
        `}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};