import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SidebarTooltip } from "./SidebarTooltip";
import { AccountCard } from "./AccountCard";

type SidebarFooterProps = {
  isCollapsed: boolean;
  name?: string;
  email?: string;
  onUpdatePassword: () => void;
  onSignOut: () => void;
};

export const SidebarFooter = ({
  isCollapsed,
  name,
  email,
  onUpdatePassword,
  onSignOut,
}: SidebarFooterProps) => {
  const { isDark, toggleTheme, getThemeClasses } = useTheme();

  return (
    <div
      className={`relative z-10 ${isCollapsed ? "px-2 pt-3 pb-4" : "px-3 pt-3 pb-4"
        } transition-colors duration-200`}
    >
      {/* Light Mode */}
      <div className="relative group">
        <button
          onClick={toggleTheme}
          className={`group flex items-center gap-3 h-9 rounded-[10px] text-sm font-medium transition-all duration-200 ${
            isCollapsed ? "justify-center px-0 w-9 mx-auto" : "w-full px-3"
          } ${getThemeClasses.text.secondary} hover:bg-surface-muted hover:text-foreground`}
        >
          <span className="w-5 flex justify-center flex-shrink-0">
            {isDark ? (
              <Sun className="w-[18px] h-[18px] text-amber-300/90" />
            ) : (
              <Moon className="w-[18px] h-[18px] text-slate-500" />
            )}
          </span>
          {!isCollapsed && (
            <span className="truncate">{isDark ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>
        {isCollapsed && (
          <SidebarTooltip>{isDark ? "Light Mode" : "Dark Mode"}</SidebarTooltip>
        )}
      </div>

      {!isCollapsed && <div className="h-px bg-border/60 my-3" />}

      {/* Account section */}
      <AccountCard
        isCollapsed={isCollapsed}
        name={name}
        email={email}
        onUpdatePassword={onUpdatePassword}
        onSignOut={onSignOut}
      />
    </div>
  );
};