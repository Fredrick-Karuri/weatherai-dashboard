/**
 * app/lib/logger.ts
 *
 * Lightweight structured logger for server-side use.
 * Wraps console methods with level, timestamp, and context.
 * In production, only warn and error are emitted.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const SILENT_IN_PRODUCTION: LogLevel[] = ["debug", "info"];

function formatMessage(level: LogLevel, context: string, message: string, meta?: unknown): string {
  const timestamp = new Date().toISOString();
  const metaPart = meta !== undefined ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}${metaPart}`;
}

function emit(level: LogLevel, context: string, message: string, meta?: unknown): void {
  if (IS_PRODUCTION && SILENT_IN_PRODUCTION.includes(level)) return;

  const line = formatMessage(level, context, message, meta);

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function createLogger(context: string) {
  return {
    debug: (message: string, meta?: unknown) => emit("debug", context, message, meta),
    info:  (message: string, meta?: unknown) => emit("info",  context, message, meta),
    warn:  (message: string, meta?: unknown) => emit("warn",  context, message, meta),
    error: (message: string, meta?: unknown) => emit("error", context, message, meta),
  };
}