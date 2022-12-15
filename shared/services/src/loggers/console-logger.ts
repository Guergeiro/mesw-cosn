import { Logger } from "../logger";

export class ConsoleLogger implements Logger {
  readonly #env: string;

  public constructor(env: string) {
    this.#env = env;
  }

  public log(...data: unknown[]) {
    if (this.willLog() === true) {
      console.log(...data);
    }
  }

  public error(...data: unknown[]) {
    if (this.willLog() === true) {
      console.error(...data);
    }
  }

  public info(...data: unknown[]) {
    if (this.willLog() === true) {
      console.info(...data);
    }
  }

  public warn(...data: unknown[]) {
    if (this.willLog() === true) {
      console.warn(...data);
    }
  }

  public debug(...data: unknown[]) {
    if (this.willLog() === true) {
      console.debug(...data);
    }
  }

  private willLog() {
    return this.#env !== "production";
  }
}
