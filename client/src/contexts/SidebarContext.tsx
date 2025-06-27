// First, let's create a context to share sidebar state
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext({
  isCollapsed: false,
  setIsCollapsed: (value: boolean) => {},
  isMobileOpen: false,
  setIsMobileOpen: (value: boolean) => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side rendering and load persisted state
  useEffect(() => {
    setIsClient(true);

    // Load sidebar state from localStorage
    const savedCollapsed = localStorage.getItem("opportune-sidebar-collapsed");
    if (savedCollapsed !== null) {
      setIsCollapsed(savedCollapsed === "true");
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(
        "opportune-sidebar-collapsed",
        isCollapsed.toString()
      );
    }
  }, [isCollapsed, isClient]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        isMobileOpen,
        setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
