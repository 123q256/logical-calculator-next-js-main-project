"use client";

/**
 * Smart Error Logger
 * Handles logging across development and production environments
 */

const LOG_STORAGE_KEY = 'app_error_logs';
const MAX_LOGS = 50;

class Logger {
  constructor() {
    this.isDev = process.env.NODE_ENV === 'development';
  }

  /**
   * Format the log entry
   */
  formatLog(level, message, error = null, additionalData = null) {
    return {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      level,
      message,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : null,
      data: additionalData,
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    };
  }

  /**
   * Save log to local storage (client-side backup)
   */
  saveToStorage(logEntry) {
    if (typeof window === 'undefined') return;

    try {
      const existingLogs = JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
      const updatedLogs = [logEntry, ...existingLogs].slice(0, MAX_LOGS);
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (e) {
      console.warn('Failed to save log to storage:', e);
    }
  }

  /**
   * Log an error
   */
  error(message, error = null, additionalData = null) {
    const logEntry = this.formatLog('error', message, error, additionalData);

    // Always log to console in dev
    if (this.isDev) {
      console.error('🔴 [ERROR]:', message, error, additionalData);
    } else {
      // In production, you might want to send this to a backend service
      // For now, we'll keep it silent in console but safe in storage
    }

    this.saveToStorage(logEntry);
    
    // Dispatch event for UI updates (LogViewer)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('new-error-log', { detail: logEntry }));
    }
  }

  /**
   * Log a warning
   */
  warn(message, data = null) {
    const logEntry = this.formatLog('warn', message, null, data);

    if (this.isDev) {
      console.warn('🟡 [WARN]:', message, data);
    }

    this.saveToStorage(logEntry);
  }

  /**
   * Log info
   */
  info(message, data = null) {
    if (this.isDev) {
      console.info('🔵 [INFO]:', message, data);
    }
  }

  /**
   * Get all stored logs
   */
  getLogs() {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(LOG_STORAGE_KEY) || '[]');
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOG_STORAGE_KEY);
    window.dispatchEvent(new Event('logs-cleared'));
  }
}

export const logger = new Logger();
