import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggleButton } from "../ThemeToggleButton";
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
  const { isDark, getThemeClasses } = useTheme();

  return (
    <div
      className={`border-t border-slate-700/50 ${isCollapsed ? "px-2 py-3" : "p-4"
        } relative z-10 space-y-3`}
    >
      {/* Theme toggle */}
      <div className="relative group">
        <div
          className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3 py-1"
            } transition-all duration-200`}
        >
          <ThemeToggleButton className="border-none shadow-none" />
          {!isCollapsed && (
            <span
              className={`text-sm font-medium ${getThemeClasses.text.secondary} transition-colors duration-200`}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </div>
        {isCollapsed && (
          <SidebarTooltip>{isDark ? "Light Mode" : "Dark Mode"}</SidebarTooltip>
        )}
      </div>

      {!isCollapsed && <div className="h-px bg-slate-700/40" />}

      {/* Account card */}
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