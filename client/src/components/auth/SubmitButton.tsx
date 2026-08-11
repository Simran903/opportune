"use client";

import React from "react";
import { Loader2, ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
  loadingLabel: string;
  label: string;
  disabled?: boolean;
}

export const SubmitButton = ({
  loading,
  loadingLabel,
  label,
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className="btn-shine group w-full py-3.5 rounded-xl font-semibold transition-all duration-300 mt-8 bg-gradient-to-br from-brand-start to-brand-end text-white shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:-translate-y-0.5 active:scale-[0.98]"
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
};