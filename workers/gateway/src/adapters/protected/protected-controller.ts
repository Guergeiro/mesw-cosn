import { AuthorizeRequest } from "@application/use-cases/authorize-request/authorize-request";
import { Controller } from "shared-controllers";
import {
  PreconditionFailedException,
  UnauthorizedException,
} from "shared-exceptions";

export class ProtectedController implements Controller {
  readonly #useCase: AuthorizeRequest;
  public constructor(useCase: AuthorizeRequest) {
    this.#useCase = useCase;
  }

  public async handle(request: Request) {
    const { pathname, hash, search } = new URL(request.url);

    const { method } = request;

    if (method === "GET") {
      // early exit point
      const host = await this.#useCase.execute({
        pathname,
        method,
      });

      return await fetch(
        this.getNewRequest(pathname, search, hash, host.hostname, request)
      );
    }

    const auth = request.headers.get("authorization");
    if (auth == null) {
      throw new UnauthorizedException();
    }
    const [basic, jwtToken] = auth.split(" ", 2);

    if (basic.toLowerCase() !== "bearer") {
      throw new PreconditionFailedException();
    }

    const host = await this.#useCase.execute({
      pathname,
      jwtToken,
      method,
    });

    return await fetch(
      this.getNewRequest(pathname, search, hash, host.hostname, request)
    );
  }

  private getNewRequest(
    pathname: string,
    search: string,
    hash: string,
    hostname: string,
    originalRequest: Request
  ) {
    const newUrl = new URL(`${pathname}${search}${hash}`, hostname);

    const newRequest = new Request(newUrl.toString(), originalRequest);

    return newRequest;
  }
}
