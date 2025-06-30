"use client";
import React from 'react';
import { X, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useSecurity } from '@/contexts/SecurityContext';

const SecurityAlerts: React.FC = () => {
  const { securityAlerts, clearSecurityAlert } = useSecurity();

  if (securityAlerts.length === 0) return null;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          text: 'text-yellow-800 dark:text-yellow-200',
          title: 'text-yellow-900 dark:text-yellow-100',
        };
      case 'error':
        return {
          container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          text: 'text-red-800 dark:text-red-200',
          title: 'text-red-900 dark:text-red-100',
        };
      case 'info':
        return {
          container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          text: 'text-blue-800 dark:text-blue-200',
          title: 'text-blue-900 dark:text-blue-100',
        };
      case 'success':
        return {
          container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          text: 'text-green-800 dark:text-green-200',
          title: 'text-green-900 dark:text-green-100',
        };
      default:
        return {
          container: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
          icon: 'text-gray-600 dark:text-gray-400',
          text: 'text-gray-800 dark:text-gray-200',
          title: 'text-gray-900 dark:text-gray-100',
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[80] space-y-2 max-w-sm">
      {securityAlerts.map((alert) => {
        const styles = getAlertStyles(alert.type);
        
        return (
          <div
            key={alert.id}
            className={`${styles.container} border rounded-lg p-4 shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2 duration-300`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${styles.icon}`}>
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${styles.title}`}>
                  {alert.title}
                </h4>
                <p className={`text-sm mt-1 ${styles.text}`}>
                  {alert.message}
                </p>
                <p className={`text-xs mt-2 ${styles.text} opacity-75`}>
                  {alert.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {alert.dismissible && (
                <button
                  onClick={() => clearSecurityAlert(alert.id)}
                  className={`flex-shrink-0 ${styles.icon} hover:opacity-75 transition-opacity duration-200`}
                  aria-label="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SecurityAlerts; 