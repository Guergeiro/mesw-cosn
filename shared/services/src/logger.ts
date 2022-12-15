export interface Logger {
  log(...data: unknown[]): void;

  error(...data: unknown[]): void;

  info(...data: unknown[]): void;

  warn(...data: unknown[]): void;

  debug(...data: unknown[]): void;
}
