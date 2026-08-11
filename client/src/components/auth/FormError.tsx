"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800/50 rounded-xl flex items-start space-x-3 animate-in slide-in-from-top-2 duration-300 shadow-sm">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <span className="text-sm font-medium text-red-700 dark:text-red-300 flex-1">
        {message}
      </span>
    </div>
  );
};