"use client";

import { useEffect } from "react";
import {
  CSRFProtection,
  SessionManager,
  SecurityLogger,
} from "@/lib/security";

export const useAuthPageInit = (page: "signin" | "signup") => {
  useEffect(() => {
    CSRFProtection.generateCSRFToken();

    SessionManager.startSession();

    SecurityLogger.logSecurityEvent("PAGE_ACCESS", {
      page,
      timestamp: new Date().toISOString(),
    });
  }, [page]);
};