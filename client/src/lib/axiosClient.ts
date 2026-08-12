import axios from 'axios';
import { TokenManager, SessionManager, CSRFProtection, SecurityLogger } from './security';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

// Request Interceptor
axiosClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      // Get encrypted token
      const token = await TokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add CSRF token for state-changing requests
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase() || '')) {
        const csrfToken = CSRFProtection.getCSRFToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
      }

      // Update session activity
      SessionManager.updateActivity();

      // Log security event
      SecurityLogger.logSecurityEvent('API_REQUEST', {
        method: config.method,
        url: config.url,
        hasAuth: !!token,
        hasCSRF: !!config.headers['X-CSRF-Token'],
      });
    }

    if (config.data && config.headers['Content-Type'] === 'application/json') {
      if (typeof config.data === 'object') {
        const jsonString = JSON.stringify(config.data);
        config.headers['Content-Length'] = jsonString.length.toString();
      }
    }

    return config;
  },
  (error) => {
    SecurityLogger.logSecurityEvent('API_REQUEST_ERROR', {
      error: error.message,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Log successful responses
    SecurityLogger.logSecurityEvent('API_RESPONSE_SUCCESS', {
      status: response.status,
      url: response.config.url,
      method: response.config.method,
    });
    return response;
  },
  async (error) => {
    if (
      typeof window !== 'undefined' &&
      error.response &&
      error.response.status === 401
    ) {
      // Token expired or invalid
      await TokenManager.removeToken();
      SessionManager.endSession();
      CSRFProtection.clearCSRFToken();
      
      SecurityLogger.logSecurityEvent('AUTH_TOKEN_EXPIRED', {
        url: error.config?.url,
        method: error.config?.method,
      });

      // Redirect to login if not already there
      if (window.location.pathname !== '/auth/signin' && window.location.pathname !== '/auth/signup') {
        window.location.href = '/auth/signin';
      }
    }

    if (error.response && error.response.status === 403) {
      SecurityLogger.logSecurityEvent('CSRF_TOKEN_INVALID', {
        url: error.config?.url,
        method: error.config?.method,
      });
    }

    SecurityLogger.logSecurityEvent('API_RESPONSE_ERROR', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      error: error.message,
    });

    return Promise.reject(error);
  }
);

export default axiosClient;