import { GetUser } from "@application/use-cases/users/get-user";
import { Controller } from "shared-controllers";

export class GetUserController implements Controller {
  readonly #useCase: GetUser;

  public constructor(useCase: GetUser) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">) {
    const { id } = request.param();

    const user = await this.#useCase.execute(id);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(user), { status: 200, headers });
  }
}
