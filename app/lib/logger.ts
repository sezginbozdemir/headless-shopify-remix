/**
 * Logging system
 *
 * This module provides a comprehensive logging system with
 * multiple log levels, context tracking, performance timing, and structured output.
 *
 * It's designed to be used throughout the application with minimal overhead,
 * while providing rich debugging information when needed.
 */

import { getEnv } from "./utils";

// Initiate environment variables

const env = getEnv();

// Log levels in order of severity

type LogLevel = "debug" | "info" | "warn" | "error";

// Context for additional information

interface LogContext {
  [key: string]: any;
}

// Timer interface for performance tracking

interface TimerData {
  start: number;
  label: string;
}

// Configuration for the logger

interface LoggerConfig {
  minLevel: LogLevel;
  includeTimestamp: boolean;
  context?: LogContext;
}

// Logger Class

class Logger {
  private source: string;
  private config: LoggerConfig;
  private timers: Map<string, TimerData>;

  private static LOG_LEVELS: { [key in LogLevel]: number } = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(source: string, config?: Partial<LoggerConfig>) {
    this.source = source;
    this.timers = new Map();

    // default config

    this.config = {
      minLevel: env.NODE_ENV === "production" ? "warn" : "debug",
      includeTimestamp: true,
      ...config,
    };
  }

  // Internal log method to handle all logging

  private log(level: LogLevel, message: string, context?: LogContext): void {
    // Check if we should log in this environment

    if (Logger.LOG_LEVELS[level] < Logger.LOG_LEVELS[this.config.minLevel]) {
      return;
    }

    // Create the log entry

    const timestamp = this.config.includeTimestamp
      ? new Date().toISOString()
      : undefined;

    const entry = {
      timestamp,
      source: this.source,
      message,
      context,
    };

    // Log the output to console

    this.consoleOutput(level, entry);
  }

  // Format and log the output to console

  private consoleOutput(level: LogLevel, entry: any) {
    const { timestamp, source, message, context } = entry;

    //Format the prefix with timestamp and source

    let prefix = `[${source}] [${level.toUpperCase()}]`;

    if (timestamp) {
      prefix = `[${timestamp.split("T")[1].replace("Z", "")}] ${prefix}`;
    }

    // Select console method

    let consoleMethod: (...data: any[]) => void;

    switch (level) {
      case "debug":
        consoleMethod = console.debug;
        break;
      case "info":
        consoleMethod = console.info;
        break;
      case "warn":
        consoleMethod = console.warn;
        break;
      case "error":
        consoleMethod = console.error;
        break;
      default:
        consoleMethod = console.log;
    }

    // Log the output entry

    if (context && Object.keys(context).length > 0) {
      consoleMethod(`${prefix} ${message}`, context);
    } else {
      consoleMethod(`${prefix} ${message}`);
    }
  }

  // Add and clear additional context to Logger instance

  public setContext(context: LogContext): void {
    this.config.context = { ...this.config.context, ...context };
  }
  public clearContext(): void {
    this.config.context = undefined;
  }

  // Log messages depending on level

  public debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }
  public info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }
  public warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }
  public error(message: string, context?: LogContext): void {
    this.log("error", message, context);
  }

  // Start a timer for performance tracking

  public startTimer(label: string): void {
    this.timers.set(label, {
      start: performance.now(),
      label,
    });
    this.debug(`Timer started: ${label}`);
  }

  // End a timer and log the duration

  public endTimer(label: string): number | null {
    const timer = this.timers.get(label);
    if (!timer) {
      this.warn(`Timer not found: ${label}`);
      return null;
    }

    const end = performance.now();
    const duration = end - timer.start;

    this.timers.delete(label);
    this.debug(`Timer ended: ${label} (${duration.toFixed(2)}ms)`);

    return duration;
  }
}

export function createLogger(
  source: string,
  config?: Partial<LoggerConfig>
): Logger {
  return new Logger(source, config);
}
