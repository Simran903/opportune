import { Key, LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { SidebarTooltip } from "./SidebarTooltip";

type AccountCardProps = {
  isCollapsed: boolean;
  name?: string;
  email?: string;
  onUpdatePassword: () => void;
  onSignOut: () => void;
};

const getInitial = (email?: string) =>
  (email && email.charAt(0).toUpperCase()) || "G";

export const AccountCard = ({
  isCollapsed,
  name,
  email,
  onUpdatePassword,
  onSignOut,
}: AccountCardProps) => {
  const { getThemeClasses } = useTheme();

  if (isCollapsed) {
    return (
      <div className="relative group flex flex-col items-center gap-1.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-bold text-sm">{getInitial(email)}</span>
        </div>

        <div className="relative group">
          <button
            onClick={onUpdatePassword}
            aria-label="Update Password"
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-emerald-500/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          >
            <Key className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          </button>
          <SidebarTooltip>Update Password</SidebarTooltip>
        </div>

        <div className="relative group">
          <button
            onClick={onSignOut}
            aria-label="Sign Out"
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-red-500/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
          >
            <LogOut className="w-4 h-4 text-red-400/80 flex-shrink-0" />
          </button>
          <SidebarTooltip>Sign Out</SidebarTooltip>
        </div>

        <SidebarTooltip>
          <div className="font-semibold">{name}</div>
          <div className="mt-0.5 text-gray-300">
            {email || "Not signed in"}
          </div>
        </SidebarTooltip>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-surface-muted shadow-soft overflow-hidden">
      {/* Identity */}
      <div className="flex items-center gap-3 px-3.5 pt-3.5 pb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-bold text-sm">{getInitial(email)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-xs font-medium ${getThemeClasses.text.secondary} truncate`}
          >
            {email || "Not signed in"}
          </div>
          <div
            className={`text-[10px] uppercase tracking-wider ${getThemeClasses.text.muted} mt-0.5`}
          >
            Account
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-700/30 mx-3.5" />

      {/* Always visible account actions */}
      <div className="p-2 space-y-0.5">
        <button
          onClick={onUpdatePassword}
          className={`group w-full flex items-center gap-2.5 pl-7 pr-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getThemeClasses.button.ghost} hover:bg-emerald-500/10 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40`}
        >
          <Key
            className={`w-4 h-4 ${getThemeClasses.accent.emerald} flex-shrink-0`}
          />
          <span
            className={`${getThemeClasses.text.secondary} group-hover:text-emerald-400 transition-colors`}
          >
            Update Password
          </span>
        </button>

        <button
          onClick={onSignOut}
          className={`group w-full flex items-center gap-2.5 pl-7 pr-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getThemeClasses.button.ghost} hover:bg-red-500/10 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40`}
        >
          <LogOut className="w-4 h-4 text-red-400/80 flex-shrink-0 group-hover:text-red-400 transition-colors" />
          <span className="text-slate-400 group-hover:text-red-400 transition-colors">
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
};