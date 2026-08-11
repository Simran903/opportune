import { Key, LogOut } from "lucide-react";
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
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-accent-emerald/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald/40"
          >
            <Key className="w-4 h-4 text-accent-emerald flex-shrink-0" />
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
          <div className="mt-0.5 text-gray-300">{email || "Not signed in"}</div>
        </SidebarTooltip>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-bold text-sm">{getInitial(email)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-foreground truncate">
            {email || "Not signed in"}
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground mt-0.5">
            Account
          </div>
        </div>
      </div>

      {/* Always visible account actions */}
      <div className="mt-2 space-y-0.5">
        <button
          onClick={onUpdatePassword}
          className={`group w-full flex items-center gap-3 h-8 rounded-lg pl-12 pr-3 text-[13px] font-medium transition-all duration-200 text-secondary-foreground hover:bg-accent-emerald/10 hover:text-accent-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald/40`}
        >
          <Key className="w-4 h-4 text-accent-emerald flex-shrink-0" />
          <span className="truncate">Update Password</span>
        </button>

        <button
          onClick={onSignOut}
          className={`group w-full flex items-center gap-3 h-8 rounded-lg pl-12 pr-3 text-[13px] font-medium transition-all duration-200 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40`}
        >
          <LogOut className="w-4 h-4 text-red-400/80 flex-shrink-0 group-hover:text-red-400 transition-colors duration-200" />
          <span className="truncate">Sign Out</span>
        </button>
      </div>
    </div>
  );
};