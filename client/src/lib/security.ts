import { jwtDecode } from 'jwt-decode';

// Security configuration
const SECURITY_CONFIG = {
  TOKEN_KEY: 'opportune_auth_token',
  REFRESH_TOKEN_KEY: 'opportune_refresh_token',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    UPPERCASE: true,
    LOWERCASE: true,
    NUMBERS: true,
    SPECIAL_CHARS: true,
  },
} as const;

// Token encryption/decryption using Web Crypto API
class TokenManager {
  private static async generateKey(): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('opportune-secure-key-2024'),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('opportune-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encryptToken(token: string): Promise<string> {
    try {
      const key = await this.generateKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedToken = new TextEncoder().encode(token);

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedToken
      );

      const encryptedArray = new Uint8Array(encrypted);
      const combined = new Uint8Array(iv.length + encryptedArray.length);
      combined.set(iv);
      combined.set(encryptedArray, iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Token encryption failed:', error);
      return token; // Fallback to plain text
    }
  }

  static async decryptToken(encryptedToken: string): Promise<string> {
    try {
      const key = await this.generateKey();
      const combined = new Uint8Array(
        atob(encryptedToken).split('').map(char => char.charCodeAt(0))
      );

      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Token decryption failed:', error);
      return encryptedToken; // Fallback to original
    }
  }

  static async storeToken(token: string): Promise<void> {
    try {
      const encryptedToken = await this.encryptToken(token);
      localStorage.setItem(SECURITY_CONFIG.TOKEN_KEY, encryptedToken);
      
      // Set token expiry
      const decoded = jwtDecode(token) as any;
      if (decoded.exp) {
        const expiryTime = decoded.exp * 1000;
        localStorage.setItem('token_expiry', expiryTime.toString());
      }
    } catch (error) {
      console.error('Failed to store token:', error);
      // Fallback to plain storage
      localStorage.setItem(SECURITY_CONFIG.TOKEN_KEY, token);
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      const encryptedToken = localStorage.getItem(SECURITY_CONFIG.TOKEN_KEY);
      if (!encryptedToken) return null;

      const token = await this.decryptToken(encryptedToken);
      
      // Check if token is expired
      const decoded = jwtDecode(token) as any;
      if (decoded.exp && Date.now() > decoded.exp * 1000) {
        this.removeToken();
        return null;
      }

      return token;
    } catch (error) {
      console.error('Failed to get token:', error);
      return localStorage.getItem(SECURITY_CONFIG.TOKEN_KEY);
    }
  }

  static removeToken(): void {
    localStorage.removeItem(SECURITY_CONFIG.TOKEN_KEY);
    localStorage.removeItem('token_expiry');
    localStorage.removeItem(SECURITY_CONFIG.REFRESH_TOKEN_KEY);
  }

  static isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode(token) as any;
      return decoded.exp && Date.now() < decoded.exp * 1000;
    } catch {
      return false;
    }
  }
}

// Input sanitization and validation
class InputSanitizer {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .slice(0, 1000); // Limit length
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim().slice(0, 254);
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  } {
    const errors: string[] = [];
    let score = 0;

    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters`);
    } else {
      score += 1;
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.NUMBERS && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIREMENTS.SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';

    return {
      isValid: errors.length === 0,
      errors,
      strength,
    };
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Rate limiting and brute force protection
class RateLimiter {
  private static attempts: Map<string, { count: number; lastAttempt: number }> = new Map();

  static checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; lockoutTime?: number } {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return { allowed: true, remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - 1 };
    }

    // Check if lockout period has passed
    if (attempt.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      const timeSinceLastAttempt = now - attempt.lastAttempt;
      if (timeSinceLastAttempt < SECURITY_CONFIG.LOCKOUT_DURATION) {
        const remainingLockout = SECURITY_CONFIG.LOCKOUT_DURATION - timeSinceLastAttempt;
        return { 
          allowed: false, 
          remainingAttempts: 0, 
          lockoutTime: Math.ceil(remainingLockout / 1000) 
        };
      } else {
        // Reset after lockout period
        this.attempts.set(identifier, { count: 1, lastAttempt: now });
        return { allowed: true, remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - 1 };
      }
    }

    // Increment attempt count
    attempt.count += 1;
    attempt.lastAttempt = now;
    this.attempts.set(identifier, attempt);

    return { 
      allowed: true, 
      remainingAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - attempt.count 
    };
  }

  static resetAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }

  static getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
    return Math.max(0, SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - attempt.count);
  }
}

// Session management
class SessionManager {
  static startSession(): void {
    const sessionId = crypto.randomUUID();
    const sessionData = {
      id: sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
    };
    
    sessionStorage.setItem('opportune_session', JSON.stringify(sessionData));
  }

  static updateActivity(): void {
    const sessionData = sessionStorage.getItem('opportune_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      session.lastActivity = Date.now();
      sessionStorage.setItem('opportune_session', JSON.stringify(session));
    }
  }

  static isSessionValid(): boolean {
    const sessionData = sessionStorage.getItem('opportune_session');
    if (!sessionData) return false;

    const session = JSON.parse(sessionData);
    const timeSinceActivity = Date.now() - session.lastActivity;
    
    return timeSinceActivity < SECURITY_CONFIG.SESSION_TIMEOUT;
  }

  static endSession(): void {
    sessionStorage.removeItem('opportune_session');
  }

  static getSessionInfo(): { id: string; startTime: number; lastActivity: number } | null {
    const sessionData = sessionStorage.getItem('opportune_session');
    return sessionData ? JSON.parse(sessionData) : null;
  }
}

// XSS Protection
class XSSProtection {
  static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static sanitizeHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Remove script tags and event handlers
    const scripts = div.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove event handlers from all elements
    const elements = div.querySelectorAll('*');
    elements.forEach(element => {
      const attrs = element.attributes;
      for (let i = attrs.length - 1; i >= 0; i--) {
        const attr = attrs[i];
        if (attr.name.startsWith('on') || attr.name.startsWith('javascript:')) {
          element.removeAttribute(attr.name);
        }
      }
    });
    
    return div.innerHTML;
  }
}

// CSRF Protection
class CSRFProtection {
  private static csrfToken: string | null = null;

  static generateCSRFToken(): string {
    if (!this.csrfToken) {
      this.csrfToken = crypto.randomUUID();
      sessionStorage.setItem('csrf_token', this.csrfToken);
    }
    return this.csrfToken;
  }

  static getCSRFToken(): string | null {
    if (!this.csrfToken) {
      this.csrfToken = sessionStorage.getItem('csrf_token');
    }
    return this.csrfToken;
  }

  static validateCSRFToken(token: string): boolean {
    const storedToken = this.getCSRFToken();
    return storedToken === token;
  }

  static clearCSRFToken(): void {
    this.csrfToken = null;
    sessionStorage.removeItem('csrf_token');
  }
}

// Security monitoring and logging
class SecurityLogger {
  static logSecurityEvent(event: string, details?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Store in session storage for debugging
    const logs = JSON.parse(sessionStorage.getItem('security_logs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 50 logs
    if (logs.length > 50) {
      logs.splice(0, logs.length - 50);
    }
    
    sessionStorage.setItem('security_logs', JSON.stringify(logs));
    
    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Security Event:', logEntry);
    }
  }

  static getSecurityLogs(): any[] {
    return JSON.parse(sessionStorage.getItem('security_logs') || '[]');
  }

  static clearSecurityLogs(): void {
    sessionStorage.removeItem('security_logs');
  }
}

// Export all security utilities
export {
  TokenManager,
  InputSanitizer,
  RateLimiter,
  SessionManager,
  XSSProtection,
  CSRFProtection,
  SecurityLogger,
  SECURITY_CONFIG,
}; 