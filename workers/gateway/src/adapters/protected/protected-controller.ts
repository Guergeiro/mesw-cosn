import { Controller } from "@adapters/controller";
import { AuthorizeRequest } from "@application/use-cases/shared/authorize-request";
import { PreconditionFailedException } from "@domain/exceptions/PreconditionFailedException";
import { UnauthorizedException } from "@domain/exceptions/UnauthorizedException";

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
    const host = await this.#useCase.execute({ pathname, jwtToken });

    const newUrl = new URL(`${pathname}${search}${hash}`, host.hostname);

    return fetch(new Request(newUrl.toString(), request));
  }
}
