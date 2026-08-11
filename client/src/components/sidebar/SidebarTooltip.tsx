import type { ReactNode } from "react";

type SidebarTooltipProps = {
  children: ReactNode;
};

const tooltipClasses =
  "absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50";

export const SidebarTooltip = ({ children }: SidebarTooltipProps) => {
  return <div className={tooltipClasses}>{children}</div>;
};