import { LoggerService } from "@application/services/logger";
import { ForbiddenException } from "@domain/exceptions/ForbiddenException";
import { NotFoundException } from "@domain/exceptions/NotFoundException";
import { PreconditionFailedException } from "@domain/exceptions/PreconditionFailedException";
import { UnauthorizedException } from "@domain/exceptions/UnauthorizedException";

export class ErrorHandler {
  readonly #logger: LoggerService;

  public constructor(logger: LoggerService) {
    this.#logger = logger;
  }

  public handle(error: unknown) {
    this.#logger.error(error);
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    if (error instanceof UnauthorizedException) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
        headers,
      });
    }
    if (error instanceof ForbiddenException) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 403,
        headers,
      });
    }
    if (error instanceof NotFoundException) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
        headers,
      });
    }
    if (error instanceof PreconditionFailedException) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 412,
        headers,
      });
    }
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers,
    });
  }
}
