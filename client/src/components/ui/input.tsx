import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-xl border bg-white/80 dark:bg-white/[0.03] px-4 py-3 text-base md:text-sm transition-all duration-300 outline-none backdrop-blur-sm",
        "border-slate-200/90 dark:border-white/10 shadow-soft",
        "placeholder:text-slate-400/90 dark:placeholder:text-slate-500",
        "hover:border-slate-300 dark:hover:border-white/20",
        "focus-visible:border-emerald-500/70 dark:focus-visible:border-emerald-400/60 focus-visible:ring-4 focus-visible:ring-emerald-500/15 focus-visible:bg-white dark:focus-visible:bg-white/[0.06]",
        "aria-invalid:border-red-500/80 aria-invalid:ring-4 aria-invalid:ring-red-500/15",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export { Input };