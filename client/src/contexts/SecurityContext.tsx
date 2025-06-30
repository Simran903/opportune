"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TokenManager, 
  SessionManager, 
  SecurityLogger, 
  RateLimiter,
  SECURITY_CONFIG 
} from '@/lib/security';

interface SecurityContextType {
  isAuthenticated: boolean;
  isSessionValid: boolean;
  securityAlerts: SecurityAlert[];
  addSecurityAlert: (alert: SecurityAlert) => void;
  clearSecurityAlert: (id: string) => void;
  clearAllAlerts: () => void;
  logout: () => Promise<void>;
  checkSecurityStatus: () => Promise<void>;
}

interface SecurityAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  dismissible?: boolean;
  autoDismiss?: number; // milliseconds
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const router = useRouter();

  const addSecurityAlert = (alert: SecurityAlert) => {
    setSecurityAlerts(prev => [...prev, alert]);
    
    // Auto-dismiss if configured
    if (alert.autoDismiss) {
      setTimeout(() => {
        clearSecurityAlert(alert.id);
      }, alert.autoDismiss);
    }
  };

  const clearSecurityAlert = (id: string) => {
    setSecurityAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setSecurityAlerts([]);
  };

  const logout = async () => {
    try {
      // Log security event
      SecurityLogger.logSecurityEvent('SECURITY_LOGOUT', {
        timestamp: new Date().toISOString(),
        reason: 'user_action',
      });

      // Clear all security data
      await TokenManager.removeToken();
      SessionManager.endSession();
      
      // Reset rate limiting
      RateLimiter.resetAttempts('global');
      
      setIsAuthenticated(false);
      setIsSessionValid(false);
      
      // Redirect to login
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
      SecurityLogger.logSecurityEvent('LOGOUT_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  };

  const checkSecurityStatus = async () => {
    try {
      // Check token validity
      const token = await TokenManager.getToken();
      const tokenValid = token && TokenManager.isTokenValid(token);
      
      // Check session validity
      const sessionValid = SessionManager.isSessionValid();
      
      setIsAuthenticated(!!tokenValid);
      setIsSessionValid(sessionValid);

      // Handle invalid states
      if (!tokenValid || !sessionValid) {
        if (tokenValid && !sessionValid) {
          addSecurityAlert({
            id: `session-expired-${Date.now()}`,
            type: 'warning',
            title: 'Session Expired',
            message: 'Your session has expired due to inactivity. Please log in again.',
            timestamp: new Date(),
            dismissible: true,
            autoDismiss: 10000,
          });
        }
        
        if (!tokenValid) {
          // Clear all data and redirect if not on auth pages
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/auth/')) {
            await logout();
          }
        }
      }

      // Log security status check
      SecurityLogger.logSecurityEvent('SECURITY_STATUS_CHECK', {
        isAuthenticated: !!tokenValid,
        isSessionValid: sessionValid,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Security status check error:', error);
      SecurityLogger.logSecurityEvent('SECURITY_CHECK_ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Initialize security monitoring
  useEffect(() => {
    const initializeSecurity = async () => {
      await checkSecurityStatus();
    };

    initializeSecurity();

    // Set up periodic security checks
    const securityCheckInterval = setInterval(checkSecurityStatus, 60000); // Every minute

    // Set up session activity monitoring
    const handleUserActivity = () => {
      SessionManager.updateActivity();
    };

    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    // Set up beforeunload event to log page exit
    const handleBeforeUnload = () => {
      SecurityLogger.logSecurityEvent('PAGE_EXIT', {
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Set up visibility change monitoring
    const handleVisibilityChange = () => {
      if (document.hidden) {
        SecurityLogger.logSecurityEvent('PAGE_HIDDEN', {
          timestamp: new Date().toISOString(),
        });
      } else {
        SecurityLogger.logSecurityEvent('PAGE_VISIBLE', {
          timestamp: new Date().toISOString(),
        });
        // Check security status when page becomes visible
        checkSecurityStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(securityCheckInterval);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Monitor for suspicious activities
  useEffect(() => {
    const checkForSuspiciousActivity = () => {
      // Check for rapid navigation (potential bot activity)
      const navigationHistory = JSON.parse(sessionStorage.getItem('navigation_history') || '[]');
      const now = Date.now();
      
      // Add current navigation
      navigationHistory.push({ url: window.location.href, timestamp: now });
      
      // Keep only last 10 navigations
      if (navigationHistory.length > 10) {
        navigationHistory.splice(0, navigationHistory.length - 10);
      }
      
      sessionStorage.setItem('navigation_history', JSON.stringify(navigationHistory));
      
      // Check for rapid navigation (less than 1 second between navigations)
      if (navigationHistory.length >= 2) {
        const lastTwo = navigationHistory.slice(-2);
        const timeDiff = lastTwo[1].timestamp - lastTwo[0].timestamp;
        
        if (timeDiff < 1000) {
          SecurityLogger.logSecurityEvent('SUSPICIOUS_RAPID_NAVIGATION', {
            timeDiff,
            from: lastTwo[0].url,
            to: lastTwo[1].url,
            timestamp: new Date().toISOString(),
          });
        }
      }
    };

    // Check on route changes
    const handleRouteChange = () => {
      checkForSuspiciousActivity();
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const value: SecurityContextType = {
    isAuthenticated,
    isSessionValid,
    securityAlerts,
    addSecurityAlert,
    clearSecurityAlert,
    clearAllAlerts,
    logout,
    checkSecurityStatus,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}; 