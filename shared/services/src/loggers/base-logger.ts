import { Logger } from "../logger";

export abstract class BaseLogger implements Logger {
  readonly #wrapped: Logger;

  public constructor(wrapped: Logger) {
    this.#wrapped = wrapped;
  }

  public log(...data: unknown[]) {
    return this.#wrapped.log(data);
  }
  public error(...data: unknown[]) {
    return this.#wrapped.log(data);
  }
  public info(...data: unknown[]) {
    return this.#wrapped.log(data);
  }
  public warn(...data: unknown[]) {
    return this.#wrapped.log(data);
  }
  public debug(...data: unknown[]) {
    return this.#wrapped.log(data);
  }
}
