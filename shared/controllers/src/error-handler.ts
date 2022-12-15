import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from "shared-exceptions";
import { Logger } from "shared-services";

export class ErrorHandler {
  readonly #logger: Logger;

  public constructor(logger: Logger) {
    this.#logger = logger;
  }

  public handle(error: Error, request: Request) {
    this.#logger.error(error, request);
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    if (error instanceof BadRequestException) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers,
      });
    }
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
    if (error instanceof InternalServerErrorException) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers,
      });
    }
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers,
      }
    );
  }
}
