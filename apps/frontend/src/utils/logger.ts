/**
 * Centralized logging utility
 * Automatically disables logs in production
 */

const isDevelopment = import.meta.env.MODE === 'development';

class Logger {
  log(...args: unknown[]) {
    if (isDevelopment) {
      console.log(...args);
    }
  }

  error(...args: unknown[]) {
    // Always log errors, even in production (but sanitize sensitive data)
    console.error(...args);
  }

  warn(...args: unknown[]) {
    if (isDevelopment) {
      console.warn(...args);
    }
  }

  info(...args: unknown[]) {
    if (isDevelopment) {
      console.info(...args);
    }
  }

  debug(...args: unknown[]) {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
}

export const logger = new Logger();
