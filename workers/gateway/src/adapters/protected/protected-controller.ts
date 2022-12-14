import { AuthorizeRequest } from "@application/use-cases/authorize-request/authorize-request";
import { Controller } from "shared-controllers";

export class ProtectedController implements Controller {
  readonly #useCase: AuthorizeRequest;
  readonly #fetchFn: (request: Request, path: string) => Promise<Response>;

  public constructor(
    useCase: AuthorizeRequest,
    fetchFn: (request: Request, path: string) => Promise<Response>
  ) {
    this.#useCase = useCase;
    this.#fetchFn = fetchFn;
  }

  public async handle(request: Request) {
    const { pathname, hash, search } = new URL(request.url);

    const { method, headers } = request;

    const host = await this.#useCase.execute({
      pathname,
      headers,
      method,
    });

    return await this.#fetchFn(
      this.getNewRequest(pathname, search, hash, host.hostname, request),
      host.pathname
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
