"use client";
import { Sidebar } from "@/components/Sidebar"
import { useTheme } from "@/contexts/ThemeContext";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { useEffect, useState } from "react";

// Inner layout component that uses the sidebar context
function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { getThemeClasses, getAnimatedBg } = useTheme();
  const { isCollapsed } = useSidebar();
  const [isClient, setIsClient] = useState(false);
  const theme = getThemeClasses;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const animatedBgClasses = isClient ? getAnimatedBg() : [];

  return (
    <div className={`min-h-screen transition-colors duration-300 relative ${theme.background}`}>
      {isClient && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {animatedBgClasses.map((className, index) => (
            <div key={`bg-${index}`} className={className}></div>
          ))}
        </div>
      )}

      <Sidebar />

      <main
        className={`
          min-h-screen transition-all duration-300 ease-in-out relative z-10
          pt-16 md:pt-0
          ${isCollapsed
            ? 'md:ml-16'
            : 'md:ml-64'
          }
        `}
      >
        <div className="p-6 w-full h-full">
          <div className={`min-h-full transition-colors duration-300`}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

// Main layout component with provider
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardLayoutInner>
        {children}
      </DashboardLayoutInner>
    </SidebarProvider>
  );
}