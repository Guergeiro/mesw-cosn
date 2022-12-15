import { captureError } from "@cfworker/sentry";
import { Logger } from "../logger";
import { BaseLogger } from "./base-logger";

export class SentryLogger extends BaseLogger {
  readonly #env: string;
  readonly #sentryDsn: string;
  readonly #release: string;

  public constructor(
    wrapped: Logger,
    env: string,
    sentryDsn: string,
    release: string
  ) {
    super(wrapped);
    this.#env = env;
    this.#sentryDsn = sentryDsn;
    this.#release = release;
  }

  public override error(...data: unknown[]) {
    super.error(data);
    if (this.willLog() === true) {
      // @ts-expect-error this will error because it doesn't know size of data.
      captureError(this.#sentryDsn, this.#env, this.#release, ...data);
    }
  }

  private willLog() {
    return this.#env === "production";
  }
}
