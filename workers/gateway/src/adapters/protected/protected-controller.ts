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
    const auth = request.headers.get("authorization");
    if (auth == null) {
      throw new UnauthorizedException();
    }
    const [basic, jwtToken] = auth.split(" ", 2);

    if (basic.toLowerCase() !== "bearer") {
      throw new PreconditionFailedException();
    }

    const { pathname, hash, search } = new URL(request.url);

    const host = await this.#useCase.execute({
      pathname,
      jwtToken,
      method: request.method,
    });

    const newUrl = new URL(`${pathname}${search}${hash}`, host.hostname);

    const newRequest = new Request(newUrl.toString(), request);

    return fetch(newRequest);
  }
}
