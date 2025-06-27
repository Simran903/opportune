"use client";
import { FC, ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import OpportuneSidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { getThemeClasses, getAnimatedBg } = useTheme();
  const theme = getThemeClasses;

  return (
    <div
      className={`min-h-screen transition-colors transition-background duration-300 relative overflow-hidden ${theme.background}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {getAnimatedBg().map((className, index) => (
          <div key={index} className={className}></div>
        ))}
      </div>
      <div className="flex h-screen">
        <OpportuneSidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
