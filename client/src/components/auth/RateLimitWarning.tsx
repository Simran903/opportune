"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export interface RateLimitInfo {
  allowed: boolean;
  remainingAttempts: number;
  lockoutTime?: number;
}

interface RateLimitWarningProps {
  rateLimitInfo: RateLimitInfo | null;
}

export const RateLimitWarning = ({ rateLimitInfo }: RateLimitWarningProps) => {
  if (!rateLimitInfo) return null;

  const lockedOut = !rateLimitInfo.allowed;
  const lowAttempts =
    rateLimitInfo.allowed &&
    rateLimitInfo.remainingAttempts <= 2 &&
    rateLimitInfo.remainingAttempts > 0;

  if (!lockedOut && !lowAttempts) return null;

  return (
    <>
      {lockedOut && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-300">
              Account temporarily locked. Try again in{" "}
              {rateLimitInfo.lockoutTime} seconds.
            </span>
          </div>
        </div>
      )}

      {lowAttempts && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-yellow-700 dark:text-yellow-300">
              {rateLimitInfo.remainingAttempts} login attempt
              {rateLimitInfo.remainingAttempts !== 1 ? "s" : ""} remaining.
            </span>
          </div>
        </div>
      )}
    </>
  );
};