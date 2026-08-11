"use client";

import React from "react";

interface ModalShellProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalShell = ({ children, className = "" }: ModalShellProps) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div
        className={`animate-scale-in rounded-2xl border border-border-accent bg-popover text-popover-foreground backdrop-blur-xl shadow-elevated ${className}`}
      >
        {children}
      </div>
    </div>
  );
};