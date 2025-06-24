import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full min-w-0 rounded-xl border-2 bg-white/90 dark:bg-slate-800/60 px-4 py-3 text-base md:text-sm shadow-sm transition-all duration-200 outline-none",
        "isolate border-slate-300 dark:border-slate-700 ring-1 ring-inset ring-slate-200 dark:ring-0 shadow-[0_1px_4px_0_rgba(60,60,60,0.04)]",
        "placeholder:text-slate-400 selection:bg-emerald-100 selection:text-emerald-900 dark:placeholder:text-slate-500 dark:selection:bg-emerald-900 dark:selection:text-white",
        "focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-400/30 focus-visible:shadow-lg",
        "aria-invalid:border-red-500 aria-invalid:ring-red-400/30 aria-invalid:focus-visible:border-red-500 aria-invalid:focus-visible:ring-red-400/40",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export { Input };