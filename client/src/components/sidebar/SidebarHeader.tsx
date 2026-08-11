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
      className={`relative flex items-center ${isCollapsed ? "pl-4" : "pl-6"
        } p-4 border-b border-slate-700/50 h-16`}
    >
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-display font-bold text-sm">O</span>
        </div>
        {!isCollapsed && (
          <span className="font-display font-semibold text-lg text-gradient">
            Opportune
          </span>
        )}
      </div>

      {/* Collapse button - only show on desktop */}
      <button
        onClick={onToggleCollapse}
        className={`
          hidden md:flex items-center justify-center
          absolute -right-3 top-1/2 transform -translate-y-1/2
          w-6 h-6 rounded-full
          ${getThemeClasses.nav} border border-slate-700/50
          ${getThemeClasses.button.ghost}
          transition-all duration-200 z-10
          shadow-lg
        `}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </div>
  );
};